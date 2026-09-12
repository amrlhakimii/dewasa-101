# Lets GitHub Actions assume an AWS role via short-lived OIDC tokens instead
# of storing a static access key/secret as a GitHub Secret.
data "tls_certificate" "github" {
  url = "https://token.actions.githubusercontent.com/.well-known/openid-configuration"
}

resource "aws_iam_openid_connect_provider" "github" {
  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = [data.tls_certificate.github.certificates[0].sha1_fingerprint]
}

resource "aws_iam_role" "github_actions" {
  name = "${var.project_name}-github-actions"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = { Federated = aws_iam_openid_connect_provider.github.arn }
        Action    = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          # GitHub's `sub` claim now embeds immutable numeric owner/repo IDs:
          # repo:owner@ownerId/repo@repoId:ref:refs/heads/main. Matching the
          # exact literal value (captured from a real token) rather than
          # pattern-matching or relying on repository/job_workflow_ref, which
          # passed IAM's write-time policy linter but were never actually
          # honored by STS at runtime for this provider.
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
            "token.actions.githubusercontent.com:sub" = "repo:amrlhakimii@100020025/dewasa-101@1367549040:ref:refs/heads/main"
          }
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "github_actions_deploy" {
  name = "deploy-dewasa-101"
  role = aws_iam_role.github_actions.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid      = "SyncBuildToS3"
        Effect   = "Allow"
        Action   = ["s3:PutObject", "s3:DeleteObject", "s3:ListBucket"]
        Resource = [aws_s3_bucket.site.arn, "${aws_s3_bucket.site.arn}/*"]
      },
      {
        Sid      = "InvalidateCloudFrontCache"
        Effect   = "Allow"
        Action   = "cloudfront:CreateInvalidation"
        Resource = aws_cloudfront_distribution.site.arn
      }
    ]
  })
}
