# AWS VPC + EC2 (Terraform)

A standard two-tier VPC across two Availability Zones with one EC2 web server.

| Resource | Count | Notes |
|---|---|---|
| VPC | 1 | 10.0.0.0/16, DNS enabled |
| Public subnets | 2 | One per AZ, routed to the Internet Gateway |
| Private subnets | 2 | One per AZ, no internet route |
| Internet Gateway | 1 | |
| Route tables | 2 | Public (0.0.0.0/0 to IGW) and private (local only) |
| Security group | 1 | HTTP 80 open, SSH only if `ssh_allowed_cidr` is set |
| EC2 | 1 | t3.micro, Amazon Linux 2023, IMDSv2, encrypted gp3, nginx, SSM access |

## No NAT Gateway (on purpose)

A NAT Gateway costs roughly 30+ GBP a month even when idle, so it is left out.
Private subnets therefore have no outbound internet. To add one, create an
`aws_eip` and an `aws_nat_gateway` in a public subnet, then add a
`0.0.0.0/0 -> nat_gateway_id` route to the private route table.

## Usage

```bash
terraform init
terraform fmt -check
terraform validate
terraform plan -out tfplan
terraform apply tfplan

# Shell in without SSH keys
aws ssm start-session --target "$(terraform output -raw instance_id)"

# Tear it all down when finished, so you are not billed
terraform destroy
```
