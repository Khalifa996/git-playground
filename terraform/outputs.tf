# outputs.tf
# Values printed after "terraform apply". Other configurations (or CI
# pipelines) can also read them with "terraform output -raw <name>".

output "vpc_id" {
  description = "ID of the VPC."
  value       = aws_vpc.main.id
}

output "public_subnet_ids" {
  description = "IDs of the public subnets, one per AZ."
  value       = aws_subnet.public[*].id # [*] is a "splat": collect .id from every copy.
}

output "private_subnet_ids" {
  description = "IDs of the private subnets, one per AZ."
  value       = aws_subnet.private[*].id
}

output "internet_gateway_id" {
  description = "ID of the Internet Gateway."
  value       = aws_internet_gateway.main.id
}

output "instance_id" {
  description = "EC2 instance ID. Use with: aws ssm start-session --target <id>"
  value       = aws_instance.web.id
}

output "instance_public_ip" {
  description = "Public IP of the EC2 instance."
  value       = aws_instance.web.public_ip
}

output "web_url" {
  description = "Open this in a browser once nginx has finished installing (give it a minute or two)."
  value       = "http://${aws_instance.web.public_dns}"
}
