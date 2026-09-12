output "cloudfront_domain_name" {
  description = "Public URL the app is served from"
  value       = "https://${aws_cloudfront_distribution.site.domain_name}"
}

output "s3_bucket_name" {
  description = "Bucket the build output gets synced to"
  value       = aws_s3_bucket.site.bucket
}

output "cloudfront_distribution_id" {
  description = "Needed for cache invalidation after each deploy"
  value       = aws_cloudfront_distribution.site.id
}

output "github_actions_role_arn" {
  description = "Paste into the GitHub Actions workflow's role-to-assume"
  value       = aws_iam_role.github_actions.arn
}

output "acm_validation_record" {
  description = "Add this CNAME record in Netlify DNS to validate the certificate"
  value = {
    name  = tolist(aws_acm_certificate.site.domain_validation_options)[0].resource_record_name
    type  = tolist(aws_acm_certificate.site.domain_validation_options)[0].resource_record_type
    value = tolist(aws_acm_certificate.site.domain_validation_options)[0].resource_record_value
  }
}
