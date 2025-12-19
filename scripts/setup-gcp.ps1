# Google Cloud Platform Initial Setup Script
# This script sets up the GCP project, enables required APIs, and configures permissions

param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectId,
    
    [Parameter(Mandatory=$false)]
    [string]$Region = "us-central1",
    
    [Parameter(Mandatory=$false)]
    [string]$ServiceName = "duckodesigns"
)

Write-Host "Setting up Google Cloud Platform for Ducko Designs..." -ForegroundColor Green

# Check if gcloud is installed
try {
    $gcloudVersion = gcloud --version 2>&1
    Write-Host "gcloud CLI found" -ForegroundColor Green
} catch {
    Write-Host "Error: gcloud CLI is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install gcloud CLI from: https://cloud.google.com/sdk/docs/install" -ForegroundColor Yellow
    exit 1
}

# Set the project
Write-Host "Setting GCP project to: $ProjectId" -ForegroundColor Cyan
gcloud config set project $ProjectId

# Check if project exists, create if it doesn't
Write-Host "Checking if project exists..." -ForegroundColor Cyan
$projectExists = gcloud projects describe $ProjectId 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Project does not exist. Creating project..." -ForegroundColor Yellow
    gcloud projects create $ProjectId
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Failed to create project. It may already exist or you may not have permissions." -ForegroundColor Red
        exit 1
    }
}

# Enable billing (user needs to do this manually)
Write-Host "`nIMPORTANT: Ensure billing is enabled for project $ProjectId" -ForegroundColor Yellow
Write-Host "Visit: https://console.cloud.google.com/billing?project=$ProjectId" -ForegroundColor Yellow
$continue = Read-Host "Press Enter to continue after enabling billing"

# Enable required APIs
Write-Host "`nEnabling required Google Cloud APIs..." -ForegroundColor Cyan
$apis = @(
    "cloudbuild.googleapis.com",
    "run.googleapis.com",
    "containerregistry.googleapis.com",
    "artifactregistry.googleapis.com",
    "sqladmin.googleapis.com",
    "storage-component.googleapis.com",
    "storage-api.googleapis.com"
)

foreach ($api in $apis) {
    Write-Host "Enabling $api..." -ForegroundColor Gray
    gcloud services enable $api --project=$ProjectId
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Warning: Failed to enable $api" -ForegroundColor Yellow
    }
}

# Set up Cloud Build service account permissions
Write-Host "`nConfiguring Cloud Build service account permissions..." -ForegroundColor Cyan
$projectNumber = (gcloud projects describe $ProjectId --format="value(projectNumber)").Trim()
$cloudBuildSA = "$projectNumber@cloudbuild.gserviceaccount.com"

Write-Host "Granting Cloud Run Admin role to Cloud Build service account..." -ForegroundColor Gray
gcloud projects add-iam-policy-binding $ProjectId `
    --member="serviceAccount:$cloudBuildSA" `
    --role="roles/run.admin"

Write-Host "Granting Service Account User role to Cloud Build service account..." -ForegroundColor Gray
gcloud projects add-iam-policy-binding $ProjectId `
    --member="serviceAccount:$cloudBuildSA" `
    --role="roles/iam.serviceAccountUser"

Write-Host "Granting Cloud SQL Client role to Cloud Build service account..." -ForegroundColor Gray
gcloud projects add-iam-policy-binding $ProjectId `
    --member="serviceAccount:$cloudBuildSA" `
    --role="roles/cloudsql.client"

# Create Cloud Run service account (optional, for fine-grained permissions)
Write-Host "`nCreating Cloud Run service account..." -ForegroundColor Cyan
$runSA = "$ServiceName-sa@$ProjectId.iam.gserviceaccount.com"
$saExists = gcloud iam service-accounts describe "$ServiceName-sa@$ProjectId.iam.gserviceaccount.com" --project=$ProjectId 2>&1
if ($LASTEXITCODE -ne 0) {
    gcloud iam service-accounts create "$ServiceName-sa" `
        --display-name="Cloud Run service account for $ServiceName" `
        --project=$ProjectId
}

# Grant Cloud SQL Client and Storage permissions to Cloud Run service account
Write-Host "Granting Cloud SQL Client role to Cloud Run service account..." -ForegroundColor Gray
gcloud projects add-iam-policy-binding $ProjectId `
    --member="serviceAccount:$runSA" `
    --role="roles/cloudsql.client"

Write-Host "Granting Storage Object Admin role to Cloud Run service account..." -ForegroundColor Gray
gcloud projects add-iam-policy-binding $ProjectId `
    --member="serviceAccount:$runSA" `
    --role="roles/storage.objectAdmin"

# Configure Docker authentication
Write-Host "`nConfiguring Docker authentication for Container Registry..." -ForegroundColor Cyan
gcloud auth configure-docker gcr.io --quiet

# Display summary
Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "Project ID: $ProjectId" -ForegroundColor Cyan
Write-Host "Region: $Region" -ForegroundColor Cyan
Write-Host "Service Name: $ServiceName" -ForegroundColor Cyan
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Review and update cloudbuild.yaml if needed" -ForegroundColor White
Write-Host "2. Run: .\scripts\deploy.ps1 -ProjectId $ProjectId" -ForegroundColor White
Write-Host "3. Or set up Cloud Build trigger for automated deployments" -ForegroundColor White
Write-Host "`nTo set up Cloud Build trigger:" -ForegroundColor Yellow
Write-Host "  gcloud builds triggers create github --repo-name=YOUR_REPO --repo-owner=YOUR_OWNER --branch-pattern='^main$' --build-config=cloudbuild.yaml" -ForegroundColor White

