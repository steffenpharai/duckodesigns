# Database Migration Script
# This script runs Prisma migrations on Cloud Run

param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectId,
    
    [Parameter(Mandatory=$false)]
    [string]$Region = "us-central1",
    
    [Parameter(Mandatory=$false)]
    [string]$ServiceName = "duckodesigns",
    
    [Parameter(Mandatory=$true)]
    [string]$ConnectionName,
    
    [Parameter(Mandatory=$true)]
    [string]$DatabaseUrl
)

Write-Host "Running database migrations..." -ForegroundColor Green

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

# Create a Cloud Run job for migrations (recommended approach)
Write-Host "`nCreating Cloud Run job for migrations..." -ForegroundColor Cyan

$jobName = "$ServiceName-migrate"

# Check if job exists
$jobExists = gcloud run jobs describe $jobName --region $Region --project=$ProjectId 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Creating migration job..." -ForegroundColor Yellow
    
    # Get the latest image
    $imageTag = "gcr.io/$ProjectId/$ServiceName`:latest"
    
    gcloud run jobs create $jobName `
        --image $imageTag `
        --region $Region `
        --service-account "$ServiceName-sa@$ProjectId.iam.gserviceaccount.com" `
        --set-cloudsql-instances $ConnectionName `
        --set-env-vars "DATABASE_URL=$DatabaseUrl" `
        --command "npx" `
        --args "prisma,migrate,deploy" `
        --project $ProjectId
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Failed to create migration job" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Migration job already exists. Updating..." -ForegroundColor Yellow
    
    # Update job with latest image and env vars
    $imageTag = "gcr.io/$ProjectId/$ServiceName`:latest"
    
    gcloud run jobs update $jobName `
        --image $imageTag `
        --region $Region `
        --update-env-vars "DATABASE_URL=$DatabaseUrl" `
        --set-cloudsql-instances $ConnectionName `
        --project $ProjectId
}

# Execute the migration job
Write-Host "`nExecuting migration job..." -ForegroundColor Cyan
gcloud run jobs execute $jobName --region $Region --project=$ProjectId --wait

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n========================================" -ForegroundColor Green
    Write-Host "Migrations completed successfully!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
} else {
    Write-Host "`nError: Migration job failed" -ForegroundColor Red
    Write-Host "Check logs with:" -ForegroundColor Yellow
    Write-Host "  gcloud run jobs executions list --job $jobName --region $Region --project=$ProjectId" -ForegroundColor White
    exit 1
}

