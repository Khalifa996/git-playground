# main.tf
# Builds a standard two-tier AWS network (public + private subnets across two
# Availability Zones) and a single EC2 instance in a public subnet.
#
# Cost note: there is deliberately NO NAT Gateway. A NAT Gateway costs roughly
# 30+ GBP a month even when idle, which is a lot for a learning lab. The
# trade-off is that anything in the private subnets cannot reach the internet
# (no "dnf update", no pulling images). See the README for how to add one.

# -----------------------------------------------------------------------------
# Terraform and provider settings
# -----------------------------------------------------------------------------

terraform {
  # Refuse to run on very old Terraform versions.
  required_version = ">= 1.10"

  required_providers {
    aws = {
      source = "hashicorp/aws"
      # "~> 6.0" means any 6.x release but never 7.0 (major versions can break things).
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  # default_tags are stamped on every resource this provider creates.
  # In production, tags are how finance tracks spend and how you find
  # "who owns this?" at 3am. Tag everything, always.
  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# -----------------------------------------------------------------------------
# Data sources: look things up from AWS rather than hard-coding them
# -----------------------------------------------------------------------------

# Ask AWS which Availability Zones are currently usable in this region.
# Hard-coding "eu-west-2a" breaks the moment someone changes region.
data "aws_availability_zones" "available" {
  state = "available"
}

# Find the latest Amazon Linux 2023 AMI via the public SSM parameter AWS
# maintains. This avoids pasting AMI IDs, which differ per region and go stale.
data "aws_ssm_parameter" "al2023_ami" {
  name = "/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64"
}

# Local values are named expressions you can reuse within this module.
locals {
  # Take the first N AZs (2 by default) so subnets are spread across them.
  azs = slice(data.aws_availability_zones.available.names, 0, var.az_count)

  # A short prefix used in Name tags so resources are easy to spot in the console.
  name_prefix = "${var.project_name}-${var.environment}"
}

# -----------------------------------------------------------------------------
# VPC: your own private, isolated network inside AWS
# -----------------------------------------------------------------------------

resource "aws_vpc" "main" {
  cidr_block = var.vpc_cidr

  # Both are needed so instances get DNS names and can resolve AWS endpoints.
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "${local.name_prefix}-vpc"
  }
}

# -----------------------------------------------------------------------------
# Internet Gateway: the VPC's door to the public internet
# -----------------------------------------------------------------------------

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${local.name_prefix}-igw"
  }
}

# -----------------------------------------------------------------------------
# Subnets
# -----------------------------------------------------------------------------

# Public subnets: one per AZ. "count" creates N copies of this resource;
# count.index (0, 1, ...) picks the matching CIDR and AZ for each copy.
resource "aws_subnet" "public" {
  count = var.az_count

  vpc_id            = aws_vpc.main.id
  cidr_block        = var.public_subnet_cidrs[count.index]
  availability_zone = local.azs[count.index]

  # Instances launched here get a public IP automatically.
  # This alone does NOT make a subnet public; the route to the IGW does (below).
  map_public_ip_on_launch = true

  tags = {
    Name = "${local.name_prefix}-public-${local.azs[count.index]}"
    Tier = "public"
  }
}

# Private subnets: no public IPs and no route to the internet.
# This is where databases and internal services live in production.
resource "aws_subnet" "private" {
  count = var.az_count

  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnet_cidrs[count.index]
  availability_zone = local.azs[count.index]

  map_public_ip_on_launch = false

  tags = {
    Name = "${local.name_prefix}-private-${local.azs[count.index]}"
    Tier = "private"
  }
}

# -----------------------------------------------------------------------------
# Route tables: the "signposts" that decide where traffic goes
# -----------------------------------------------------------------------------

# Public route table: anything not inside the VPC (0.0.0.0/0) goes to the IGW.
# THIS route is what actually makes a subnet "public".
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "${local.name_prefix}-public-rt"
  }
}

# Attach every public subnet to the public route table.
resource "aws_route_table_association" "public" {
  count = var.az_count

  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# Private route table: only the implicit "local" route (traffic inside the VPC).
# With a NAT Gateway you would add: 0.0.0.0/0 -> nat_gateway_id here.
resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${local.name_prefix}-private-rt"
  }
}

resource "aws_route_table_association" "private" {
  count = var.az_count

  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private.id
}

# -----------------------------------------------------------------------------
# Security group: a stateful firewall attached to the EC2 instance
# -----------------------------------------------------------------------------

resource "aws_security_group" "web" {
  name        = "${local.name_prefix}-web-sg"
  description = "Allow HTTP in, optional SSH from a trusted IP, all outbound"
  vpc_id      = aws_vpc.main.id

  tags = {
    Name = "${local.name_prefix}-web-sg"
  }
}

# Modern best practice is one resource per rule (instead of inline
# ingress/egress blocks), so adding or removing a rule never rewrites the others.
resource "aws_vpc_security_group_ingress_rule" "http" {
  security_group_id = aws_security_group.web.id
  description       = "HTTP from anywhere"
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "tcp"
  from_port         = 80
  to_port           = 80
}

# SSH is only opened if you set ssh_allowed_cidr (e.g. "203.0.113.10/32").
# Leaving it null means no rule is created at all. Never open 22 to 0.0.0.0/0:
# bots will be brute-forcing it within minutes.
resource "aws_vpc_security_group_ingress_rule" "ssh" {
  count = var.ssh_allowed_cidr == null ? 0 : 1

  security_group_id = aws_security_group.web.id
  description       = "SSH from a single trusted IP"
  cidr_ipv4         = var.ssh_allowed_cidr
  ip_protocol       = "tcp"
  from_port         = 22
  to_port           = 22
}

# Allow all outbound traffic (needed for package updates, AWS APIs, etc.).
resource "aws_vpc_security_group_egress_rule" "all_out" {
  security_group_id = aws_security_group.web.id
  description       = "All outbound traffic"
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1" # "-1" means every protocol and port.
}

# -----------------------------------------------------------------------------
# IAM: let Session Manager (SSM) manage the instance
# -----------------------------------------------------------------------------
# SSM Session Manager gives you a shell in the browser or CLI with no SSH keys
# and no port 22 open. It is the modern standard over SSH bastions.

resource "aws_iam_role" "ec2" {
  name = "${local.name_prefix}-ec2-role"

  # The "trust policy": who is allowed to assume (wear) this role. Here, EC2.
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}

# AWS-managed policy with the minimum permissions the SSM agent needs.
resource "aws_iam_role_policy_attachment" "ssm_core" {
  role       = aws_iam_role.ec2.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

# EC2 cannot use a role directly; it needs an "instance profile" wrapper.
resource "aws_iam_instance_profile" "ec2" {
  name = "${local.name_prefix}-ec2-profile"
  role = aws_iam_role.ec2.name
}

# -----------------------------------------------------------------------------
# EC2 instance
# -----------------------------------------------------------------------------

resource "aws_instance" "web" {
  ami                    = data.aws_ssm_parameter.al2023_ami.value
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.public[0].id # First public subnet.
  vpc_security_group_ids = [aws_security_group.web.id]
  iam_instance_profile   = aws_iam_instance_profile.ec2.name

  # Optional: only used if you want classic SSH. null means no key pair.
  key_name = var.key_name

  # Force IMDSv2 (session tokens for the metadata service). IMDSv1 was the
  # route used in the 2019 Capital One breach via SSRF. Always require v2.
  metadata_options {
    http_endpoint = "enabled"
    http_tokens   = "required"
  }

  # Encrypt the disk. Costs nothing extra and auditors will ask.
  root_block_device {
    volume_type = "gp3"
    volume_size = var.root_volume_size
    encrypted   = true
  }

  # A tiny boot script that installs nginx so you can test HTTP straight away.
  user_data = <<-EOT
    #!/bin/bash
    dnf install -y nginx
    echo "<h1>Hello from ${local.name_prefix}</h1>" > /usr/share/nginx/html/index.html
    systemctl enable --now nginx
  EOT

  # If user_data changes, replace the instance so the new script actually runs.
  user_data_replace_on_change = true

  tags = {
    Name = "${local.name_prefix}-web"
  }
}
