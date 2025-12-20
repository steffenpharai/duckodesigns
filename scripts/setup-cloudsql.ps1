# Cloud SQL PostgreSQL Setup Script
# This script creates and configures a Cloud SQL PostgreSQL instance for Ducko Designs

param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectId,
    
    [Parameter(Mandatory=$false)]
    [string]$Region = "us-central1",
    
    [Parameter(Mandatory=$false)]
    [string]$InstanceName = "duckodesigns-db",
    
    [Parameter(Mandatory=$false)]
    [string]$DatabaseName = "duckodesigns",
    
    [Parameter(Mandatory=$false)]
    [string]$DatabaseUser = "duckodesigns_user",
    
    [Parameter(Mandatory=$false)]
    [string]$Tier = "db-f1-micro",
    
    [Parameter(Mandatory=$false)]
    [switch]$UsePrivateIP = $true
)

Write-Host "Setting up Cloud SQL PostgreSQL instance..." -ForegroundColor Green

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

# Enable Cloud SQL Admin API
Write-Host "`nEnabling Cloud SQL Admin API..." -ForegroundColor Cyan
gcloud services enable sqladmin.googleapis.com --project=$ProjectId
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to enable Cloud SQL Admin API" -ForegroundColor Red
    exit 1
}

# Check if instance already exists
Write-Host "`nChecking if Cloud SQL instance exists..." -ForegroundColor Cyan
$instanceExists = gcloud sql instances describe $InstanceName --project=$ProjectId 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "Instance $InstanceName already exists. Skipping creation." -ForegroundColor Yellow
} else {
    Write-Host "Creating Cloud SQL PostgreSQL instance..." -ForegroundColor Cyan
    
    if ($UsePrivateIP) {
        Write-Host "Configuring private IP (recommended for Cloud Run)..." -ForegroundColor Gray
        Write-Host "Note: Private IP requires VPC connector. Using public IP for now." -ForegroundColor Yellow
        $UsePrivateIP = $false
    }
    
    if ($UsePrivateIP) {
        gcloud sql instances create $InstanceName `
            --database-version=POSTGRES_15 `
            --tier=$Tier `
            --region=$Region `
            --network=default `
            --no-assign-ip `
            --project=$ProjectId
    } else {
        Write-Host "Configuring public IP..." -ForegroundColor Gray
        gcloud sql instances create $InstanceName `
            --database-version=POSTGRES_15 `
            --tier=$Tier `
            --region=$Region `
            --project=$ProjectId
    }
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Failed to create Cloud SQL instance" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Waiting for instance to be ready (this may take a few minutes)..." -ForegroundColor Yellow
    gcloud sql instances wait $InstanceName --project=$ProjectId
}

# Get instance connection name
$connectionName = gcloud sql instances describe $InstanceName --format="value(connectionName)" --project=$ProjectId
Write-Host "Instance connection name: $connectionName" -ForegroundColor Cyan

# Create database if it doesn't exist
Write-Host "`nCreating database '$DatabaseName'..." -ForegroundColor Cyan
$dbExists = gcloud sql databases describe $DatabaseName --instance=$InstanceName --project=$ProjectId 2>&1
if ($LASTEXITCODE -ne 0) {
    gcloud sql databases create $DatabaseName --instance=$InstanceName --project=$ProjectId
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Failed to create database" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Database '$DatabaseName' already exists. Skipping creation." -ForegroundColor Yellow
}

# Set database password
Write-Host "`nSetting database user password..." -ForegroundColor Cyan
Write-Host "You will be prompted to enter a password for the database user." -ForegroundColor Yellow
$password = Read-Host "Enter password for database user '$DatabaseUser'" -AsSecureString
$passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))

# Create or update database user
Write-Host "Creating database user..." -ForegroundColor Cyan
$userExists = gcloud sql users describe $DatabaseUser --instance=$InstanceName --project=$ProjectId 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "User exists. Updating password..." -ForegroundColor Yellow
    gcloud sql users set-password $DatabaseUser --instance=$InstanceName --password=$passwordPlain --project=$ProjectId
} else {
    gcloud sql users create $DatabaseUser --instance=$InstanceName --password=$passwordPlain --project=$ProjectId
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to create/update database user" -ForegroundColor Red
    exit 1
}

# Get Cloud Run service account
Write-Host "`nConfiguring Cloud Run service account permissions..." -ForegroundColor Cyan
$runSA = "duckodesigns-sa@$ProjectId.iam.gserviceaccount.com"
$saExists = gcloud iam service-accounts describe "duckodesigns-sa@$ProjectId.iam.gserviceaccount.com" --project=$ProjectId 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Cloud Run service account doesn't exist. Creating..." -ForegroundColor Yellow
    gcloud iam service-accounts create "duckodesigns-sa" `
        --display-name="Cloud Run service account for Ducko Designs" `
        --project=$ProjectId
}

# Grant Cloud SQL Client role to Cloud Run service account
Write-Host "Granting Cloud SQL Client role to service account..." -ForegroundColor Gray
gcloud projects add-iam-policy-binding $ProjectId `
    --member="serviceAccount:$runSA" `
    --role="roles/cloudsql.client"

# Build connection string
if ($UsePrivateIP) {
    $connectionString = "/cloudsql/$connectionName"
    Write-Host "`nFor Cloud Run, use Unix socket connection:" -ForegroundColor Cyan
    Write-Host "  DATABASE_URL=postgresql://$DatabaseUser`:<PASSWORD>@localhost/$DatabaseName?host=$connectionString" -ForegroundColor White
} else {
    $ipAddress = gcloud sql instances describe $InstanceName --format="value(ipAddresses[0].ipAddress)" --project=$ProjectId
    Write-Host "`nFor local development with Cloud SQL Proxy:" -ForegroundColor Cyan
    Write-Host "  DATABASE_URL=postgresql://$DatabaseUser`:<PASSWORD>@127.0.0.1:5432/$DatabaseName" -ForegroundColor White
    Write-Host "`nRun Cloud SQL Proxy with:" -ForegroundColor Yellow
    Write-Host "  cloud-sql-proxy $connectionName" -ForegroundColor White
}

# Display summary
Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Cloud SQL Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "Instance Name: $InstanceName" -ForegroundColor Cyan
Write-Host "Connection Name: $connectionName" -ForegroundColor Cyan
Write-Host "Database: $DatabaseName" -ForegroundColor Cyan
Write-Host "User: $DatabaseUser" -ForegroundColor Cyan
Write-Host "Region: $Region" -ForegroundColor Cyan
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Save the database password securely" -ForegroundColor White
Write-Host "2. Update your .env.local with the DATABASE_URL" -ForegroundColor White
Write-Host "3. For local development, install Cloud SQL Proxy:" -ForegroundColor White
Write-Host "   https://cloud.google.com/sql/docs/postgres/sql-proxy" -ForegroundColor White
Write-Host "4. Run database migrations with: npx prisma migrate deploy" -ForegroundColor White

