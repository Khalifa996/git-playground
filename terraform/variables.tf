# variables.tf
# Inputs for this configuration. Override defaults in a terraform.tfvars file
# or with -var on the command line, rather than editing this file.

variable "aws_region" {
  description = "AWS region to deploy into."
  type        = string
  default     = "eu-west-2" # London
}

variable "project_name" {
  description = "Short name used in resource names and tags."
  type        = string
  default     = "vpc-lab"
}

variable "environment" {
  description = "Environment name, e.g. dev, staging or prod."
  type        = string
  default     = "dev"

  # Validation catches typos at plan time instead of after resources exist.
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "environment must be one of: dev, staging, prod."
  }
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC. /16 gives 65,536 addresses."
  type        = string
  default     = "10.0.0.0/16"

  validation {
    condition     = can(cidrhost(var.vpc_cidr, 0))
    error_message = "vpc_cidr must be a valid IPv4 CIDR, e.g. 10.0.0.0/16."
  }
}

variable "az_count" {
  description = "How many Availability Zones to spread subnets across."
  type        = number
  default     = 2

  validation {
    condition     = var.az_count >= 2
    error_message = "Use at least 2 AZs so one data centre failing does not take everything down."
  }
}

variable "public_subnet_cidrs" {
  description = "One CIDR per AZ for the public subnets. Must sit inside vpc_cidr."
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "One CIDR per AZ for the private subnets. Must sit inside vpc_cidr."
  type        = list(string)
  default     = ["10.0.101.0/24", "10.0.102.0/24"]
}

variable "instance_type" {
  description = "EC2 instance size. t3.micro is Free Tier eligible in most regions."
  type        = string
  default     = "t3.micro"
}

variable "root_volume_size" {
  description = "Root disk size in GiB."
  type        = number
  default     = 8
}

variable "key_name" {
  description = "Optional existing EC2 key pair name for SSH. Leave null and use SSM Session Manager instead."
  type        = string
  default     = null
}

variable "ssh_allowed_cidr" {
  description = "Optional single IP allowed to SSH in, e.g. \"203.0.113.10/32\". Leave null to keep port 22 closed."
  type        = string
  default     = null

  validation {
    condition     = var.ssh_allowed_cidr == null || var.ssh_allowed_cidr != "0.0.0.0/0"
    error_message = "Do not open SSH to the whole internet. Use your own IP with /32."
  }
}
