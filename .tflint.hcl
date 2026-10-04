# .tflint.hcl: settings for tflint, the Terraform linter.
# terraform validate only checks the code is legal. tflint goes further and catches
# things that are legal but wrong: unused variables, deprecated syntax, and (with the
# AWS plugin) mistakes such as an EC2 instance type that does not exist.
# This file sits at the repo root so the CI job can lint every Terraform folder with one config.

config {
  # Also inspect local modules (folders called with source = "./..."), not just the root code.
  call_module_type = "local"
}

# The built-in Terraform ruleset. "recommended" is the sensible default set of rules
# (unused declarations, missing version constraints, deprecated interpolation and so on).
plugin "terraform" {
  enabled = true
  preset  = "recommended"
}

# The AWS ruleset. Checks AWS-specific values that Terraform itself cannot know are wrong,
# for example instance_type = "t3.mircro" (typo) passes terraform validate but fails here.
# "tflint --init" downloads this plugin. Pin the version so a new release cannot break CI overnight.
plugin "aws" {
  enabled = true
  version = "0.49.0"
  source  = "github.com/terraform-linters/tflint-ruleset-aws"
}
