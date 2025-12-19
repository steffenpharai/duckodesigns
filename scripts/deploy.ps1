# Google Cloud Run Deployment Script
# This script builds and deploys the application to Cloud Run

param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectId,
    
    [Parameter(Mandatory=$false)]
    [string]$Region = "us-central1",
    
    [Parameter(Mandatory=$false)]
    [string]$ServiceName = "duckodesigns",
    
    [Parameter(Mandatory=$false)]
    [switch]$UseCloudBuild = $false
)

Write-Host "Deploying Ducko Designs to Google Cloud Run..." -ForegroundColor Green

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

# Check if Docker is running (for local builds)
if (-not $UseCloudBuild) {
    try {
        docker ps | Out-Null
        Write-Host "Docker is running" -ForegroundColor Green
    } catch {
        Write-Host "Error: Docker is not running. Please start Docker Desktop." -ForegroundColor Red
        exit 1
    }
}

if ($UseCloudBuild) {
    # Deploy using Cloud Build
    Write-Host "`nDeploying using Cloud Build..." -ForegroundColor Cyan
    Write-Host "This will build and deploy automatically." -ForegroundColor Gray
    
    gcloud builds submit --config=cloudbuild.yaml --project=$ProjectId
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Cloud Build deployment failed" -ForegroundColor Red
        exit 1
    }
} else {
    # Manual deployment: build locally and deploy
    Write-Host "`nBuilding Docker image locally..." -ForegroundColor Cyan
    
    $imageTag = "gcr.io/$ProjectId/$ServiceName`:latest"
    docker build -t $imageTag .
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Docker build failed" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Pushing image to Container Registry..." -ForegroundColor Cyan
    docker push $imageTag
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Failed to push image" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Deploying to Cloud Run..." -ForegroundColor Cyan
    gcloud run deploy $ServiceName `
        --image $imageTag `
        --region $Region `
        --platform managed `
        --allow-unauthenticated `
        --memory 512Mi `
        --cpu 1 `
        --timeout 300 `
        --max-instances 10 `
        --min-instances 0 `
        --port 8080 `
        --project $ProjectId
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Cloud Run deployment failed" -ForegroundColor Red
        exit 1
    }
}

# Get the service URL
Write-Host "`nRetrieving service URL..." -ForegroundColor Cyan
$serviceUrl = gcloud run services describe $ServiceName --region $Region --format="value(status.url)" --project=$ProjectId

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "Service URL: $serviceUrl" -ForegroundColor Cyan
Write-Host "`nTo view logs:" -ForegroundColor Yellow
Write-Host "  gcloud run services logs read $ServiceName --region $Region --project=$ProjectId" -ForegroundColor White
Write-Host "`nTo update environment variables:" -ForegroundColor Yellow
Write-Host "  gcloud run services update $ServiceName --region $Region --update-env-vars KEY=VALUE --project=$ProjectId" -ForegroundColor White

