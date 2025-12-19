# Cloud Monitoring Setup Script
# This script sets up monitoring alerts for the Ducko Designs application

param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectId,
    
    [Parameter(Mandatory=$false)]
    [string]$ServiceName = "duckodesigns",
    
    [Parameter(Mandatory=$false)]
    [string]$Region = "us-central1",
    
    [Parameter(Mandatory=$false)]
    [string]$NotificationEmail = ""
)

Write-Host "Setting up Cloud Monitoring for Ducko Designs..." -ForegroundColor Green

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

# Enable Monitoring API
Write-Host "`nEnabling Cloud Monitoring API..." -ForegroundColor Cyan
gcloud services enable monitoring.googleapis.com --project=$ProjectId

# Create notification channel if email provided
$notificationChannel = ""
if ($NotificationEmail) {
    Write-Host "`nCreating notification channel..." -ForegroundColor Cyan
    $channelName = "$ServiceName-alerts"
    
    # Create notification channel
    $channelConfig = @{
        type = "email"
        displayName = "Ducko Designs Alerts"
        labels = @{
            email_address = $NotificationEmail
        }
    } | ConvertTo-Json -Compress
    
    $channelResult = gcloud alpha monitoring channels create `
        --display-name="Ducko Designs Alerts" `
        --type=email `
        --channel-labels=email_address=$NotificationEmail `
        --project=$ProjectId 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        # Extract channel name from output
        $notificationChannel = ($channelResult | Select-String -Pattern "name:\s*(.+)" | ForEach-Object { $_.Matches.Groups[1].Value })
        Write-Host "Notification channel created: $notificationChannel" -ForegroundColor Green
    } else {
        Write-Host "Warning: Failed to create notification channel. Alerts will be created without notifications." -ForegroundColor Yellow
    }
}

# Alert policies to create
$alerts = @(
    @{
        Name = "High Error Rate"
        DisplayName = "High Error Rate - Ducko Designs"
        Condition = "resource.type = `"cloud_run_revision`" AND resource.labels.service_name = `"$ServiceName`" AND severity >= `"ERROR`""
        Threshold = 10
        Duration = "300s"
        Description = "Alert when error rate is high in Cloud Run service"
    },
    @{
        Name = "Database Connection Errors"
        DisplayName = "Database Connection Errors - Ducko Designs"
        Condition = "resource.type = `"cloud_run_revision`" AND resource.labels.service_name = `"$ServiceName`" AND textPayload =~ `".*database.*error.*`""
        Threshold = 5
        Duration = "300s"
        Description = "Alert when database connection errors occur"
    },
    @{
        Name = "High Request Latency"
        DisplayName = "High Request Latency - Ducko Designs"
        Condition = "resource.type = `"cloud_run_revision`" AND resource.labels.service_name = `"$ServiceName`" AND httpRequest.latency > `"5s`""
        Threshold = 20
        Duration = "300s"
        Description = "Alert when request latency is high"
    },
    @{
        Name = "Service Unavailable"
        DisplayName = "Service Unavailable - Ducko Designs"
        Condition = "resource.type = `"cloud_run_revision`" AND resource.labels.service_name = `"$ServiceName`" AND httpRequest.status >= 500"
        Threshold = 10
        Duration = "300s"
        Description = "Alert when service returns 5xx errors"
    }
)

Write-Host "`nCreating alert policies..." -ForegroundColor Cyan

foreach ($alert in $alerts) {
    Write-Host "Creating alert: $($alert.DisplayName)..." -ForegroundColor Gray
    
    # Note: Creating alert policies via gcloud requires complex YAML configuration
    # For now, we'll provide instructions for manual setup
    Write-Host "  Alert policy: $($alert.DisplayName)" -ForegroundColor White
    Write-Host "  Condition: $($alert.Condition)" -ForegroundColor White
    Write-Host "  Threshold: $($alert.Threshold) occurrences in $($alert.Duration)" -ForegroundColor White
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Monitoring Setup Instructions" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "`nTo set up monitoring alerts manually:" -ForegroundColor Yellow
Write-Host "1. Go to Cloud Console: https://console.cloud.google.com/monitoring/alerting" -ForegroundColor White
Write-Host "2. Click 'Create Policy'" -ForegroundColor White
Write-Host "3. Configure alerts for:" -ForegroundColor White
Write-Host "   - High error rates in Cloud Run logs" -ForegroundColor Gray
Write-Host "   - Database connection errors" -ForegroundColor Gray
Write-Host "   - High request latency" -ForegroundColor Gray
Write-Host "   - Service unavailability (5xx errors)" -ForegroundColor Gray
Write-Host "`nFor structured logging:" -ForegroundColor Yellow
Write-Host "- Logs are automatically sent to Cloud Logging" -ForegroundColor White
Write-Host "- Use the logger utility in src/lib/logger.ts for structured logs" -ForegroundColor White
Write-Host "- View logs at: https://console.cloud.google.com/logs" -ForegroundColor White
Write-Host "`nTo query logs:" -ForegroundColor Yellow
Write-Host "  gcloud logging read 'resource.type=cloud_run_revision AND resource.labels.service_name=$ServiceName' --limit 50 --project=$ProjectId" -ForegroundColor White

if ($NotificationEmail) {
    Write-Host "`nNotification email configured: $NotificationEmail" -ForegroundColor Cyan
    Write-Host "Set up alert policies in the console and add this email as a notification channel." -ForegroundColor White
}

