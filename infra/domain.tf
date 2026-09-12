# amrlhakimi.my's DNS is on Netlify (outside AWS), so this only requests the
# cert — the validation CNAME and the final domain CNAME both get pasted into
# Netlify's DNS panel by hand (see terraform output acm_validation_record and
# cloudfront_domain_name).
resource "aws_acm_certificate" "site" {
  provider          = aws.us_east_1
  domain_name       = var.custom_domain
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}
