# deploy-s3.ps1 - Deploy Suraksha LMS to AWS S3 + CloudFront
# Usage: .\deploy-s3.ps1 -BucketName "your-bucket-name" [-DistributionId "EXXXXXXXX"]
#
# Prerequisites:
#   - AWS CLI installed and configured (aws configure)
#   - S3 bucket configured for static website hosting
#   - Error document set to: index.html (CRITICAL for SPA routing)

param(
    [Parameter(Mandatory=$true)]
    [string]$BucketName,
    
    [Parameter(Mandatory=$false)]
    [string]$DistributionId
)

$ErrorActionPreference = "Stop"

Write-Host "=== Suraksha LMS - S3 Deployment ===" -ForegroundColor Cyan

# Step 1: Build
Write-Host "`n[1/4] Building production bundle..." -ForegroundColor Yellow
npm run build:prod
if ($LASTEXITCODE -ne 0) { throw "Build failed" }

# Step 2: Upload hashed assets with long cache (JS, CSS, images)
Write-Host "`n[2/4] Uploading hashed assets (1 year cache)..." -ForegroundColor Yellow
aws s3 sync dist/ "s3://$BucketName/" `
    --exclude "index.html" `
    --exclude "version.json" `
    --exclude "firebase-messaging-sw.js" `
    --cache-control "public, max-age=31536000, immutable" `
    --delete

# Step 3: Upload index.html, version.json, and SW with NO cache
Write-Host "`n[3/4] Uploading index.html & version.json (no cache)..." -ForegroundColor Yellow
aws s3 cp dist/index.html "s3://$BucketName/index.html" `
    --cache-control "no-cache, no-store, must-revalidate" `
    --content-type "text/html"

if (Test-Path dist/version.json) {
    aws s3 cp dist/version.json "s3://$BucketName/version.json" `
        --cache-control "no-cache, no-store, must-revalidate" `
        --content-type "application/json"
}

if (Test-Path dist/firebase-messaging-sw.js) {
    aws s3 cp dist/firebase-messaging-sw.js "s3://$BucketName/firebase-messaging-sw.js" `
        --cache-control "no-cache, no-store, must-revalidate" `
        --content-type "application/javascript"
}

# Step 4: Invalidate CloudFront cache (if distribution provided)
if ($DistributionId) {
    Write-Host "`n[4/4] Invalidating CloudFront cache..." -ForegroundColor Yellow
    aws cloudfront create-invalidation `
        --distribution-id $DistributionId `
        --paths "/index.html" "/version.json" "/firebase-messaging-sw.js"
    Write-Host "CloudFront invalidation started" -ForegroundColor Green
} else {
    Write-Host "`n[4/4] Skipping CloudFront invalidation (no DistributionId provided)" -ForegroundColor DarkGray
}

Write-Host "`n=== Deployment complete! ===" -ForegroundColor Green
Write-Host "IMPORTANT: Make sure your S3 bucket or CloudFront has:"
Write-Host "  - Error document set to 'index.html' (for SPA routing)"
Write-Host "  - If using CloudFront: Custom Error Response for 404 -> /index.html (HTTP 200)"
