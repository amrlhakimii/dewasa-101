variable "aws_region" {
  description = "AWS region to deploy into"
  type        = string
  default     = "ap-southeast-1"
}

variable "project_name" {
  description = "Project name, used for resource naming"
  type        = string
  default     = "dewasa-101"
}

variable "github_repo" {
  description = "GitHub repo allowed to assume the deploy role, as owner/repo"
  type        = string
  default     = "amrlhakimii/dewasa-101"
}

variable "custom_domain" {
  description = "Custom domain to serve the site on, e.g. dewasa.amrlhakimi.my"
  type        = string
  default     = "dewasa.amrlhakimi.my"
}
