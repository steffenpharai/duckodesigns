# Production Deployment Script with Migrations
# This script triggers Cloud Build with database migrations

param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectId,
    
    [Parameter(Mandatory=$false)]
    [string]$Region = "us-central1"
)

Write-Host "Deploying with database migrations..." -ForegroundColor Green

# Get database password from Secret Manager
Write-Host "`nRetrieving database connection from Secret Manager..." -ForegroundColor Cyan
$dbUrlBuild = gcloud secrets versions access latest --secret=database-url --project=$ProjectId 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to retrieve database-url secret" -ForegroundColor Red
    Write-Host "Make sure the secret exists and you have access" -ForegroundColor Yellow
    exit 1
}

Write-Host "Triggering Cloud Build with migrations..." -ForegroundColor Cyan
gcloud builds submit --config=cloudbuild.yaml `
    --substitutions="_DATABASE_URL_BUILD=$dbUrlBuild" `
    --project=$ProjectId

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n========================================" -ForegroundColor Green
    Write-Host "Deployment Complete!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Yellow
    Write-Host "1. Verify migrations ran successfully in build logs" -ForegroundColor White
    Write-Host "2. Seed the database with: npm run db:seed" -ForegroundColor White
    Write-Host "3. Check service URL:" -ForegroundColor White
    Write-Host "   gcloud run services describe duckodesigns --region=$Region --format='value(status.url)' --project=$ProjectId" -ForegroundColor Gray
} else {
    Write-Host "`nDeployment failed. Check build logs for details." -ForegroundColor Red
    exit 1
}

