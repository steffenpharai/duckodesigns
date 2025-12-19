# Cloud Storage Setup Script
# This script creates a Cloud Storage bucket for order images

param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectId,
    
    [Parameter(Mandatory=$false)]
    [string]$BucketName = "duckodesigns-order-images",
    
    [Parameter(Mandatory=$false)]
    [string]$Region = "us-central1"
)

Write-Host "Setting up Cloud Storage bucket for Ducko Designs..." -ForegroundColor Green

# Check if gcloud is installed
try {
    $gcloudVersion = gcloud --version 2>&1
    Write-Host "gcloud CLI found" -ForegroundColor Green
} catch {
    Write-Host "Error: gcloud CLI is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Set the project
Write-Host "Setting GCP project to: $ProjectId" -ForegroundColor Cyan
gcloud config set project $ProjectId

# Enable Storage API if not already enabled
Write-Host "`nEnabling Cloud Storage API..." -ForegroundColor Cyan
gcloud services enable storage-component.googleapis.com --project=$ProjectId
gcloud services enable storage-api.googleapis.com --project=$ProjectId

# Check if bucket already exists
Write-Host "`nChecking if bucket exists..." -ForegroundColor Cyan
$bucketExists = gsutil ls -b gs://$BucketName 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "Bucket '$BucketName' already exists. Skipping creation." -ForegroundColor Yellow
} else {
    Write-Host "Creating Cloud Storage bucket..." -ForegroundColor Cyan
    gsutil mb -p $ProjectId -c STANDARD -l $Region gs://$BucketName
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Failed to create bucket" -ForegroundColor Red
        exit 1
    }
}

# Configure CORS for web uploads
Write-Host "`nConfiguring CORS for web uploads..." -ForegroundColor Cyan
$corsConfig = @"
[
  {
    "origin": ["*"],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
    "responseHeader": ["Content-Type", "Access-Control-Allow-Origin"],
    "maxAgeSeconds": 3600
  }
]
"@

$corsConfig | Out-File -FilePath "$env:TEMP\cors-config.json" -Encoding UTF8
gsutil cors set "$env:TEMP\cors-config.json" gs://$BucketName
Remove-Item "$env:TEMP\cors-config.json"

# Set lifecycle policy to delete old images after 1 year
Write-Host "`nSetting lifecycle policy..." -ForegroundColor Cyan
$lifecycleConfig = @"
{
  "lifecycle": {
    "rule": [
      {
        "action": {"type": "Delete"},
        "condition": {"age": 365}
      }
    ]
  }
}
"@

$lifecycleConfig | Out-File -FilePath "$env:TEMP\lifecycle-config.json" -Encoding UTF8
gsutil lifecycle set "$env:TEMP\lifecycle-config.json" gs://$BucketName
Remove-Item "$env:TEMP\lifecycle-config.json"

# Make bucket publicly readable for images (optional - adjust based on security needs)
Write-Host "`nConfiguring bucket permissions..." -ForegroundColor Cyan
Write-Host "Setting bucket to allow public read access for images..." -ForegroundColor Gray
gsutil iam ch allUsers:objectViewer gs://$BucketName

# Display summary
Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Cloud Storage Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "Bucket Name: $BucketName" -ForegroundColor Cyan
Write-Host "Region: $Region" -ForegroundColor Cyan
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Update your .env.local with:" -ForegroundColor White
Write-Host "   GCS_BUCKET_NAME=$BucketName" -ForegroundColor Gray
Write-Host "   GCS_PROJECT_ID=$ProjectId" -ForegroundColor Gray
Write-Host "2. For local development, set GCS_KEY_FILE to your service account key path" -ForegroundColor White
Write-Host "3. For Cloud Run, ensure service account has Storage Object Admin role" -ForegroundColor White

