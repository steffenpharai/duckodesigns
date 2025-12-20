# Script to promote a user to ADMIN role
# Usage: .\scripts\promote-user-to-admin.ps1 -ProjectId "ducko-designs" -UserEmail "pharaisteffen@gmail.com"

param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectId,
    
    [Parameter(Mandatory=$true)]
    [string]$UserEmail,
    
    [Parameter(Mandatory=$false)]
    [string]$Region = "us-central1",
    
    [Parameter(Mandatory=$false)]
    [string]$InstanceName = "duckodesigns-db"
)

Write-Host "Promoting user to ADMIN role..." -ForegroundColor Green
Write-Host "User Email: $UserEmail" -ForegroundColor Cyan
Write-Host "Project: $ProjectId" -ForegroundColor Cyan

# Get database connection details
Write-Host "`nGetting database connection details..." -ForegroundColor Cyan
$dbUrl = gcloud secrets versions access latest --secret=cloud-run-database-url --project=$ProjectId
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to get database URL from Secret Manager" -ForegroundColor Red
    exit 1
}

# Extract connection details from the URL
# Format: postgresql://user:password@localhost/dbname?host=/cloudsql/PROJECT:REGION:INSTANCE
$connectionName = "$ProjectId`:$Region`:$InstanceName"

Write-Host "`nConnecting to database..." -ForegroundColor Cyan
Write-Host "Connection Name: $connectionName" -ForegroundColor Gray

# Create a temporary SQL file
$sqlFile = [System.IO.Path]::GetTempFileName() + ".sql"
$sqlContent = @"
-- Update user role to ADMIN
UPDATE "User" 
SET role = 'ADMIN', "updatedAt" = NOW()
WHERE email = '$UserEmail';

-- Verify the update
SELECT id, email, name, role, "createdAt"
FROM "User"
WHERE email = '$UserEmail';
"@

$sqlContent | Out-File -FilePath $sqlFile -Encoding UTF8

Write-Host "`nExecuting SQL update..." -ForegroundColor Cyan

# Use gcloud sql connect to execute the SQL
# Note: This requires Cloud SQL Proxy or direct connection
# Alternative: Use psql with Cloud SQL Proxy

# Check if psql is available
$psqlAvailable = Get-Command psql -ErrorAction SilentlyContinue

if ($psqlAvailable) {
    Write-Host "Using psql with Cloud SQL Proxy..." -ForegroundColor Cyan
    Write-Host "Note: You need to have Cloud SQL Proxy running or use gcloud sql connect" -ForegroundColor Yellow
    
    # Try to connect via Cloud SQL Proxy (if running on localhost:5432)
    # Or use gcloud sql connect
    Write-Host "`nTo update the user role, run one of the following:" -ForegroundColor Yellow
    Write-Host "`nOption 1: Using gcloud sql connect (interactive)" -ForegroundColor Cyan
    Write-Host "gcloud sql connect $InstanceName --user=duckodesigns_user --database=duckodesigns --project=$ProjectId" -ForegroundColor White
    Write-Host "Then run: UPDATE `"User`" SET role = 'ADMIN' WHERE email = '$UserEmail';" -ForegroundColor White
    
    Write-Host "`nOption 2: Using Node.js script (recommended)" -ForegroundColor Cyan
    Write-Host "A Node.js script will be created to update the role using Prisma" -ForegroundColor Gray
} else {
    Write-Host "psql not found. Creating Node.js script instead..." -ForegroundColor Yellow
}

# Create a Node.js script to update the role
$nodeScript = @"
// Script to promote user to ADMIN role
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function promoteUser() {
  try {
    const userEmail = '$UserEmail';
    
    console.log(`Updating user role for: ${userEmail}`);
    
    const user = await prisma.user.update({
      where: { email: userEmail },
      data: { role: 'ADMIN' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
    
    console.log('User role updated successfully!');
    console.log('User details:', JSON.stringify(user, null, 2));
  } catch (error) {
    if (error.code === 'P2025') {
      console.error(`Error: User with email ${userEmail} not found`);
    } else {
      console.error('Error updating user role:', error);
    }
    process.exit(1);
  } finally {
    await prisma.`$disconnect();
  }
}

promoteUser();
"@

$nodeScriptFile = "scripts/promote-user.js"
$nodeScript | Out-File -FilePath $nodeScriptFile -Encoding UTF8

Write-Host "`nCreated Node.js script: $nodeScriptFile" -ForegroundColor Green
Write-Host "`nTo run the script:" -ForegroundColor Cyan
Write-Host "1. Set DATABASE_URL environment variable:" -ForegroundColor Yellow
Write-Host "   `$env:DATABASE_URL=`"$dbUrl`"" -ForegroundColor White
Write-Host "2. Run the script:" -ForegroundColor Yellow
Write-Host "   node scripts/promote-user.js" -ForegroundColor White

Write-Host "`nOr use gcloud sql connect:" -ForegroundColor Cyan
Write-Host "gcloud sql connect $InstanceName --user=duckodesigns_user --database=duckodesigns --project=$ProjectId" -ForegroundColor White
Write-Host "Then run: UPDATE `"User`" SET role = 'ADMIN' WHERE email = '$UserEmail';" -ForegroundColor White

# Clean up temp file
Remove-Item $sqlFile -ErrorAction SilentlyContinue

