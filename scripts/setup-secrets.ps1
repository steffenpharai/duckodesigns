# Secret Manager Setup Script
# This script sets up secrets in Google Secret Manager for secure configuration

param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectId,
    
    [Parameter(Mandatory=$false)]
    [string]$DatabaseUrl = ""
)

Write-Host "Setting up Secret Manager for Ducko Designs..." -ForegroundColor Green

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

# Enable Secret Manager API
Write-Host "`nEnabling Secret Manager API..." -ForegroundColor Cyan
gcloud services enable secretmanager.googleapis.com --project=$ProjectId

# Get project number for service account
$projectNumber = (gcloud projects describe $ProjectId --format="value(projectNumber)").Trim()
$cloudBuildSA = "$projectNumber@cloudbuild.gserviceaccount.com"

# Create database-url secret if provided
if ($DatabaseUrl) {
    Write-Host "`nCreating database-url secret..." -ForegroundColor Cyan
    
    # Check if secret exists
    $secretExists = gcloud secrets describe database-url --project=$ProjectId 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Secret exists. Adding new version..." -ForegroundColor Yellow
        echo -n $DatabaseUrl | gcloud secrets versions add database-url --data-file=- --project=$ProjectId
    } else {
        echo -n $DatabaseUrl | gcloud secrets create database-url --data-file=- --project=$ProjectId
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Granting Cloud Build service account access to secret..." -ForegroundColor Cyan
        gcloud secrets add-iam-policy-binding database-url `
            --member="serviceAccount:$cloudBuildSA" `
            --role="roles/secretmanager.secretAccessor" `
            --project=$ProjectId
        
        Write-Host "Granting Cloud Run service account access to secret..." -ForegroundColor Cyan
        gcloud secrets add-iam-policy-binding database-url `
            --member="serviceAccount:duckodesigns-sa@$ProjectId.iam.gserviceaccount.com" `
            --role="roles/secretmanager.secretAccessor" `
            --project=$ProjectId
        
        Write-Host "Database URL secret created successfully!" -ForegroundColor Green
    } else {
        Write-Host "Error: Failed to create database-url secret" -ForegroundColor Red
    }
} else {
    Write-Host "`nTo create database-url secret, run:" -ForegroundColor Yellow
    Write-Host "  echo -n 'postgresql://user:pass@localhost/db?host=/cloudsql/...' | gcloud secrets create database-url --data-file=- --project=$ProjectId" -ForegroundColor White
}

# Create nextauth-secret if needed
Write-Host "`nChecking for nextauth-secret..." -ForegroundColor Cyan
$nextAuthExists = gcloud secrets describe nextauth-secret --project=$ProjectId 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Creating nextauth-secret..." -ForegroundColor Yellow
    $nextAuthSecret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
    echo -n $nextAuthSecret | gcloud secrets create nextauth-secret --data-file=- --project=$ProjectId
    
    if ($LASTEXITCODE -eq 0) {
        gcloud secrets add-iam-policy-binding nextauth-secret `
            --member="serviceAccount:$cloudBuildSA" `
            --role="roles/secretmanager.secretAccessor" `
            --project=$ProjectId
        
        gcloud secrets add-iam-policy-binding nextauth-secret `
            --member="serviceAccount:duckodesigns-sa@$ProjectId.iam.gserviceaccount.com" `
            --role="roles/secretmanager.secretAccessor" `
            --project=$ProjectId
        
        Write-Host "NEXTAUTH_SECRET created and stored securely!" -ForegroundColor Green
    }
} else {
    Write-Host "nextauth-secret already exists" -ForegroundColor Yellow
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Secret Manager Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "`nSecrets are now stored securely in Secret Manager." -ForegroundColor Cyan
Write-Host "Cloud Build and Cloud Run can access them automatically." -ForegroundColor Cyan


