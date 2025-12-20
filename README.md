# Ducko Designs Website

A modern, production-ready website for Ducko Designs - a family-owned toddler clothing brand offering custom clothing & accessories including ponchos, pajamas, booties, gloves, shirts, pants, sets, and more.

## Current Status

### ✅ Production Ready
- **Website**: Fully functional with all core features implemented
- **Google Cloud Deployment**: Configured and ready for deployment to Cloud Run
- **CI/CD**: Automated deployment pipeline via Cloud Build
- **Docker**: Multi-stage optimized Dockerfile with standalone Next.js output
- **Infrastructure**: Complete GCP setup scripts and deployment automation

### 🚀 Deployment Status

**Google Cloud Run**: ✅ **DEPLOYED AND OPERATIONAL**
- Service URL: `https://duckodesigns-33ybtimjra-uc.a.run.app`
- Status: Ready and serving traffic
- Latest Revision: `duckodesigns-00013-g9n`
- Cloud Build configuration (`cloudbuild.yaml`) configured and tested
- Multi-stage Dockerfile optimized for production
- Standalone Next.js output for minimal container size
- Automated IAM permissions and service account setup
- PowerShell deployment scripts for Windows

**Security Configuration**:
- ✅ Secrets stored in Secret Manager (not plaintext)
- ✅ Database credentials secured
- ✅ NextAuth secret secured
- ✅ Service account has minimal required permissions
- ✅ Public access properly configured

**Infrastructure**:
- ✅ Cloud SQL PostgreSQL instance running
- ✅ Database migrations executed
- ✅ Cloud Storage bucket configured
- ✅ Secret Manager secrets created
- ✅ IAM permissions verified

**Key Features**:
- Automated builds on code push (via Cloud Build triggers)
- Manual deployment via PowerShell scripts
- Public access configured
- Auto-scaling (0-10 instances)
- Production-optimized settings (512Mi memory, 1 CPU, 300s timeout)
- Dynamic NEXTAUTH_URL configuration
- Secure secret management

### 📋 Next Steps
- ✅ Custom domain configured (duckodesigns.com)
- ✅ Database migrations completed
- ✅ Security hardening completed
- Optional: Set up Cloud Build trigger for automated deployments
- Optional: Add monitoring and alerting
- Optional: Seed database with initial product data

## Tech Stack

- **Next.js 14+** with App Router
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **shadcn/ui** for accessible UI components
- **Google Cloud Run** for serverless deployment
- **Cloud Build** for CI/CD automation

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with Header/Footer
│   ├── page.tsx            # Home page
│   ├── shop/               # Shop listing page
│   ├── product/[id]/       # Product detail pages
│   ├── custom-order/       # Custom order form
│   ├── about/              # About page
│   ├── contact/            # Contact page
│   ├── policies/           # Policy pages (shipping, returns, privacy)
│   ├── sitemap.ts          # Dynamic sitemap
│   └── robots.ts           # Robots.txt
├── components/             # Reusable React components
│   ├── ui/                 # shadcn/ui base components
│   ├── Header.tsx          # Site header/navigation
│   ├── Footer.tsx          # Site footer
│   ├── ProductCard.tsx     # Product grid card
│   ├── ProductGallery.tsx  # Product image gallery
│   ├── StickyCTA.tsx       # Mobile sticky CTA button
│   └── ...                 # Other components
├── config/
│   └── site.ts             # Site configuration (brand name, social links, etc.)
├── content/
│   ├── faq.ts             # FAQ content
│   ├── policies.ts        # Policy content
│   └── about.ts           # About page content
├── data/
│   └── products.ts        # Product data
└── lib/
    └── utils.ts           # Utility functions
```

## Customization Guide

### Updating Products

Edit `src/data/products.ts` to add, modify, or remove products. Each product should have:

- `id`: Unique identifier
- `name`: Product name
- `price`: Price in USD
- `images`: Array of image paths (relative to `/public/images/`)
- `description`: Product description
- `tags`: Array of tags
- `category`: One of "poncho", "pajamas", "pants", "shirt", "booties", "gloves", "set", "accessory", or "other"
- `featured`: Boolean for featured products
- `fabricOptions`: Array of available fabric options
- `sizes`: Optional array of available sizes
- `customizable`: Boolean (default true) - whether the product can be customized
- `turnaround`: String (e.g., "1–2 weeks") - estimated production time
- `isCarSeatFriendly`: Boolean (optional) - only applicable to ponchos; indicates if the poncho is designed for car seat use

### Updating Site Configuration

Edit `src/config/site.ts` to update:

- Brand name and description
- Social media links (Facebook, Instagram)
- Contact email
- CTA button text
- Site URL

### Updating Content

- **FAQs**: Edit `src/content/faq.ts`
- **Policies**: Edit `src/content/policies.ts`
- **About Page**: Edit `src/content/about.ts`

### Adding Product Images

1. Add product images to `public/images/products/`
2. Update the `images` array in `src/data/products.ts` with the correct paths

Example:
```typescript
images: [
  "/images/products/classic-poncho-1.jpg",
  "/images/products/classic-poncho-2.jpg",
]
```

### Styling

The site uses TailwindCSS with a custom color scheme defined in `src/app/globals.css`. To update colors:

1. Modify the CSS variables in `src/app/globals.css`
2. Or update the Tailwind config in `tailwind.config.ts`

## Deployment to Google Cloud Run

This project is **fully configured and production-ready** for deployment to Google Cloud Run using Cloud Build for automated CI/CD. The application uses Next.js standalone output mode for optimized Docker builds and minimal container size.

### Prerequisites

1. **Google Cloud Account**: Sign up at [cloud.google.com](https://cloud.google.com)
2. **gcloud CLI**: Install from [cloud.google.com/sdk/docs/install](https://cloud.google.com/sdk/docs/install)
3. **Docker**: Required for local builds (optional if using Cloud Build only)
4. **Billing**: Enable billing for your GCP project

### Initial Setup (One-Time)

1. **Authenticate with Google Cloud**:

```powershell
gcloud auth login
gcloud auth application-default login
```

2. **Run the setup script**:

```powershell
.\scripts\setup-gcp.ps1 -ProjectId "your-project-id" -Region "us-central1"
```

This script will:
- Create or verify your GCP project
- Enable required APIs:
  - Cloud Build API (`cloudbuild.googleapis.com`)
  - Cloud Run API (`run.googleapis.com`)
  - Container Registry API (`containerregistry.googleapis.com`)
  - Artifact Registry API (`artifactregistry.googleapis.com`)
  - Cloud SQL Admin API (`sqladmin.googleapis.com`)
  - Secret Manager API (`secretmanager.googleapis.com`)
  - Storage API (`storage-api.googleapis.com`)
- Configure IAM permissions for Cloud Build service account
- Create Cloud Run service account with required permissions:
  - `roles/cloudsql.client` (for database access)
  - `roles/secretmanager.secretAccessor` (for Secret Manager)
  - `roles/storage.objectAdmin` (for Cloud Storage)
- Configure Docker authentication for Container Registry

**Note**: You'll need to enable billing manually in the Google Cloud Console if the project is new. The script will prompt you to do this.

3. **Set up Cloud SQL database** (if not already done):

```powershell
.\scripts\setup-cloudsql.ps1 -ProjectId "your-project-id" -Region "us-central1"
```

4. **Set up Secret Manager secrets**:

```powershell
.\scripts\setup-secrets.ps1 -ProjectId "your-project-id" -DatabaseUrl "postgresql://user:password@localhost/dbname?host=/cloudsql/PROJECT_ID:REGION:INSTANCE_NAME"
```

This will create:
- `cloud-run-database-url`: Database connection string for Cloud Run
- `nextauth-secret`: NextAuth.js secret (auto-generated if not provided)

5. **Set up Cloud Storage bucket** (for order images):

```powershell
.\scripts\setup-storage.ps1 -ProjectId "your-project-id" -BucketName "duckodesigns-order-images"
```

### Deployment Methods

#### Option 1: Automated Deployment with Cloud Build

Cloud Build automatically builds and deploys when you push to your repository.

1. **Set up Cloud Build trigger** (one-time):

```powershell
gcloud builds triggers create github `
  --repo-name="YOUR_REPO_NAME" `
  --repo-owner="YOUR_GITHUB_USERNAME" `
  --branch-pattern="^main$" `
  --build-config="cloudbuild.yaml" `
  --project="your-project-id"
```

2. **Deploy automatically**:
   - Push code to your `main` branch
   - Cloud Build will automatically build and deploy to Cloud Run
   - **Important**: After first deployment, run database migrations (see Database Migrations section below)

#### Option 2: Manual Deployment via PowerShell Script

Deploy manually using the provided PowerShell script:

```powershell
# Using Cloud Build (recommended)
.\scripts\deploy.ps1 -ProjectId "your-project-id" -UseCloudBuild

# Or build locally and deploy
.\scripts\deploy.ps1 -ProjectId "your-project-id" -Region "us-central1"
```

**Note**: After deployment, you must run database migrations before the service will work properly (see Database Migrations section).

#### Option 3: Direct gcloud CLI Deployment

For more control, use gcloud CLI directly:

```powershell
# Build and submit to Cloud Build
gcloud builds submit --config=cloudbuild.yaml --project=your-project-id

# Or build locally and deploy
docker build -t gcr.io/your-project-id/duckodesigns:latest .
docker push gcr.io/your-project-id/duckodesigns:latest
gcloud run deploy duckodesigns `
  --image gcr.io/your-project-id/duckodesigns:latest `
  --region us-central1 `
  --platform managed `
  --allow-unauthenticated `
  --project your-project-id
```

### Configuration Files

- **`Dockerfile`**: Multi-stage Docker build optimized for Next.js production with standalone output
- **`cloudbuild.yaml`**: Complete Cloud Build configuration with automated deployment to Cloud Run
- **`next.config.js`**: Configured with `output: 'standalone'` for optimized container builds
- **`.dockerignore`**: Files excluded from Docker builds
- **`.gcloudignore`**: Files excluded from gcloud deployments
- **`scripts/setup-gcp.ps1`**: Automated GCP project setup script (enables APIs, configures IAM, creates service accounts)
- **`scripts/deploy.ps1`**: PowerShell deployment script supporting both Cloud Build and local Docker builds
- **`scripts/setup-cloudsql.ps1`**: Cloud SQL PostgreSQL instance setup script
- **`scripts/setup-secrets.ps1`**: Secret Manager setup script for secure credential storage
- **`scripts/setup-storage.ps1`**: Cloud Storage bucket setup script for order images
- **`scripts/migrate.ps1`**: Database migration script using Cloud Run Jobs

### Cloud Run Service Settings

Default configuration (configured in `cloudbuild.yaml` and can be adjusted):

- **Memory**: 512Mi
- **CPU**: 1
- **Timeout**: 300s (5 minutes)
- **Max Instances**: 10
- **Min Instances**: 0 (scale to zero for cost efficiency)
- **Port**: 8080
- **Region**: us-central1 (configurable)
- **Machine Type**: E2_HIGHCPU_8 (for Cloud Build)
- **Public Access**: Enabled (allUsers with roles/run.invoker)
- **Build Timeout**: 1200s (20 minutes)
- **Secrets**: Managed via Secret Manager (DATABASE_URL, NEXTAUTH_SECRET)
- **Service Account**: `duckodesigns-sa@PROJECT_ID.iam.gserviceaccount.com` with:
  - `roles/cloudsql.client` (database access)
  - `roles/secretmanager.secretAccessor` (secret access)
  - `roles/storage.objectAdmin` (Cloud Storage access)

### Managing Environment Variables and Secrets

#### Environment Variables (Non-Sensitive)

Set non-sensitive environment variables:

```powershell
gcloud run services update duckodesigns `
  --region us-central1 `
  --update-env-vars "GCS_BUCKET_NAME=duckodesigns-order-images,GCS_PROJECT_ID=your-project-id" `
  --project your-project-id
```

#### Secrets (Sensitive Data)

**Important**: Sensitive data like database URLs and API keys should be stored in Secret Manager, not as environment variables.

The service is configured to use Secret Manager for:
- `DATABASE_URL` - Loaded from `cloud-run-database-url` secret
- `NEXTAUTH_SECRET` - Loaded from `nextauth-secret` secret

To update secrets:

```powershell
# Update database URL secret
echo -n "postgresql://user:password@localhost/db?host=/cloudsql/..." | gcloud secrets versions add cloud-run-database-url --data-file=- --project=your-project-id

# Update NextAuth secret
echo -n "your-secret-key" | gcloud secrets versions add nextauth-secret --data-file=- --project=your-project-id
```

To add new secrets to the service:

```powershell
gcloud run services update duckodesigns `
  --region us-central1 `
  --update-secrets "SECRET_NAME=secret-name:latest" `
  --project your-project-id
```

**Current Secrets Configuration**:
- `DATABASE_URL` → `cloud-run-database-url:latest`
- `NEXTAUTH_SECRET` → `nextauth-secret:latest`

### Database Migrations

Before the application can run, you need to run Prisma migrations to create the database tables:

```powershell
# Get the database URL from Secret Manager
$dbUrl = gcloud secrets versions access latest --secret=cloud-run-database-url --project=your-project-id

# Run migrations using the migrate script
.\scripts\migrate.ps1 `
  -ProjectId "your-project-id" `
  -Region "us-central1" `
  -ConnectionName "your-project-id:us-central1:duckodesigns-db" `
  -DatabaseUrl $dbUrl
```

Or manually using Cloud Run Jobs:

```powershell
# Create/update migration job
gcloud run jobs update duckodesigns-migrate `
  --image gcr.io/your-project-id/duckodesigns:latest `
  --region us-central1 `
  --service-account duckodesigns-sa@your-project-id.iam.gserviceaccount.com `
  --set-cloudsql-instances your-project-id:us-central1:duckodesigns-db `
  --update-secrets="DATABASE_URL=cloud-run-database-url:latest" `
  --command npx `
  --args "prisma,migrate,deploy" `
  --project your-project-id

# Execute the migration
gcloud run jobs execute duckodesigns-migrate --region us-central1 --project your-project-id --wait
```

**Note**: Migrations should be run after each deployment if the Prisma schema changes.

### Viewing Logs

```powershell
# Cloud Run service logs
gcloud run services logs read duckodesigns --region us-central1 --project your-project-id

# Cloud Build logs
gcloud builds log BUILD_ID --project your-project-id

# Migration job logs
gcloud run jobs executions logs read EXECUTION_ID --job duckodesigns-migrate --region us-central1 --project your-project-id
```

### Custom Domain Setup (duckodesigns.com)

To map your custom domain `duckodesigns.com` to the Cloud Run service:

#### Prerequisites

1. **Verify domain ownership** (required before creating domain mapping):
   - Visit [Google Search Console](https://search.google.com/search-console) to verify your domain
   - Or use: `gcloud domains verify duckodesigns.com --project your-project-id`

#### Step 1: Create Domain Mapping

```powershell
gcloud beta run domain-mappings create `
  --service duckodesigns `
  --domain duckodesigns.com `
  --region us-central1 `
  --project your-project-id
```

This will output the DNS records (A and AAAA records) that need to be configured.

#### Step 2: Set Up Cloud DNS (Recommended)

1. **Create a Cloud DNS managed zone**:

```powershell
gcloud dns managed-zones create duckodesigns-zone `
  --dns-name=duckodesigns.com `
  --description="DNS zone for duckodesigns.com" `
  --project your-project-id
```

2. **Get the Cloud DNS nameservers**:

```powershell
gcloud dns managed-zones describe duckodesigns-zone `
  --project your-project-id `
  --format="value(nameServers)"
```

3. **Add DNS records to Cloud DNS**:

```powershell
# Start transaction
gcloud dns record-sets transaction start --zone=duckodesigns-zone --project your-project-id

# Add A records (replace with values from Step 1)
gcloud dns record-sets transaction add 216.239.32.21 216.239.34.21 216.239.36.21 216.239.38.21 `
  --name=duckodesigns.com. `
  --type=A `
  --ttl=300 `
  --zone=duckodesigns-zone `
  --project your-project-id

# Add AAAA records (replace with values from Step 1)
gcloud dns record-sets transaction add 2001:4860:4802:32::15 2001:4860:4802:34::15 2001:4860:4802:36::15 2001:4860:4802:38::15 `
  --name=duckodesigns.com. `
  --type=AAAA `
  --ttl=300 `
  --zone=duckodesigns-zone `
  --project your-project-id

# Execute transaction
gcloud dns record-sets transaction execute --zone=duckodesigns-zone --project your-project-id
```

4. **Update nameservers at your domain registrar**:
   - Log in to your domain registrar (e.g., Squarespace, Google Domains)
   - Update nameservers to the Cloud DNS nameservers from Step 2.2
   - Example nameservers: `ns-cloud-c1.googledomains.com`, `ns-cloud-c2.googledomains.com`, etc.

#### Step 3: Verify SSL Certificate Status

Check the domain mapping and SSL certificate status:

```powershell
# Check overall status
gcloud beta run domain-mappings describe --domain duckodesigns.com `
  --region us-central1 `
  --project your-project-id

# Check certificate status
gcloud beta run domain-mappings describe --domain duckodesigns.com `
  --region us-central1 `
  --project your-project-id `
  --format="value(status.conditions[?type=='CertificateProvisioned'].status,status.conditions[?type=='CertificateProvisioned'].message)"

# Check ready status
gcloud beta run domain-mappings describe --domain duckodesigns.com `
  --region us-central1 `
  --project your-project-id `
  --format="value(status.conditions[?type=='Ready'].status,status.conditions[?type=='Ready'].message)"
```

#### Step 4: Verify DNS Propagation

```powershell
# Check if DNS has propagated
nslookup -type=A duckodesigns.com 8.8.8.8

# Verify nameservers
nslookup -type=NS duckodesigns.com
```

#### Status Indicators

- **CertificatePending**: DNS records are configured, waiting for SSL certificate provisioning (15-60 minutes)
- **Ready: True**: Domain is active and accessible
- **DomainRoutable: True**: Domain mapping is correctly configured

Once DNS has propagated and the SSL certificate is provisioned, `duckodesigns.com` will be live and accessible over HTTPS.

**Note**: DNS propagation typically takes 1-4 hours (up to 48 hours). SSL certificate provisioning begins automatically once DNS records are detected and usually completes within 15-60 minutes.

### Monitoring and Management

- **Cloud Console**: [console.cloud.google.com/run](https://console.cloud.google.com/run)
- **Cloud Build History**: [console.cloud.google.com/cloud-build](https://console.cloud.google.com/cloud-build)
- **Logs**: [console.cloud.google.com/logs](https://console.cloud.google.com/logs)
- **Service URL**: Retrieved automatically after deployment via `deploy.ps1` script

### Current Deployment Status

**✅ Production Deployment Verified and Operational**

- **Service**: `duckodesigns` in `us-central1`
- **Status**: Ready and serving traffic
- **URL**: `https://duckodesigns-33ybtimjra-uc.a.run.app`
- **Latest Revision**: `duckodesigns-00013-g9n`

**Security Configuration**:
- ✅ All secrets stored in Secret Manager (no plaintext credentials)
- ✅ Database connection using Unix socket via Cloud SQL Proxy
- ✅ Service account has minimal required IAM permissions
- ✅ Public access properly configured with IAM bindings

**Infrastructure Verified**:
- ✅ Cloud SQL PostgreSQL instance: `duckodesigns-db` (RUNNABLE)
- ✅ Database: `duckodesigns` created
- ✅ Database migrations: Successfully executed
- ✅ Cloud Storage bucket: `duckodesigns-order-images` configured
- ✅ Secret Manager secrets: `cloud-run-database-url`, `nextauth-secret`
- ✅ IAM permissions: All required roles granted

**Service Account Permissions** (`duckodesigns-sa`):
- `roles/cloudsql.client` - Database access
- `roles/secretmanager.secretAccessor` - Secret Manager access
- `roles/storage.objectAdmin` - Cloud Storage access

**Cloud Build Service Account Permissions**:
- `roles/run.admin` - Deploy and manage Cloud Run services
- `roles/iam.serviceAccountUser` - Use service accounts
- `roles/secretmanager.secretAccessor` - Access secrets during build

### Quick Deployment Commands

```powershell
# One-time setup
.\scripts\setup-gcp.ps1 -ProjectId "your-project-id" -Region "us-central1"
.\scripts\setup-cloudsql.ps1 -ProjectId "your-project-id" -Region "us-central1"
.\scripts\setup-secrets.ps1 -ProjectId "your-project-id" -DatabaseUrl "postgresql://..."
.\scripts\setup-storage.ps1 -ProjectId "your-project-id"

# Deploy using Cloud Build (recommended)
.\scripts\deploy.ps1 -ProjectId "your-project-id" -UseCloudBuild

# Run database migrations (after first deployment)
$dbUrl = gcloud secrets versions access latest --secret=cloud-run-database-url --project=your-project-id
.\scripts\migrate.ps1 -ProjectId "your-project-id" -ConnectionName "your-project-id:us-central1:duckodesigns-db" -DatabaseUrl $dbUrl

# Deploy with local Docker build
.\scripts\deploy.ps1 -ProjectId "your-project-id" -Region "us-central1"

# View service URL
gcloud run services describe duckodesigns --region us-central1 --format="value(status.url)" --project=your-project-id

# Check service status
gcloud run services describe duckodesigns --region us-central1 --format="value(status.conditions[0].status)" --project=your-project-id
```

### Verifying Deployment

After deployment, verify everything is working:

```powershell
# Check service is ready
gcloud run services describe duckodesigns --region us-central1 --format="value(status.conditions[0].status)" --project=your-project-id

# Test the service
$url = gcloud run services describe duckodesigns --region us-central1 --format="value(status.url)" --project=your-project-id
Invoke-WebRequest -Uri $url -UseBasicParsing

# Check logs for errors
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=duckodesigns AND severity>=ERROR" --limit=10 --freshness=10m --project=your-project-id

# Verify secrets are loaded
gcloud run services describe duckodesigns --region us-central1 --format="yaml(spec.template.spec.containers[0].env)" --project=your-project-id

# Verify IAM permissions
gcloud projects get-iam-policy your-project-id --flatten="bindings[].members" --filter="bindings.members:serviceAccount:duckodesigns-sa@your-project-id.iam.gserviceaccount.com" --format="table(bindings.role)"
```

### Required Environment Variables and Secrets

#### Environment Variables (Set in Cloud Run)

- `GCS_BUCKET_NAME`: Cloud Storage bucket name for order images (e.g., `duckodesigns-order-images`)
- `GCS_PROJECT_ID`: Your GCP project ID
- `NEXTAUTH_URL`: The public URL of your Cloud Run service (automatically set by Cloud Build)

#### Secrets (Stored in Secret Manager)

- `DATABASE_URL`: PostgreSQL connection string (stored in `cloud-run-database-url` secret)
- `NEXTAUTH_SECRET`: NextAuth.js secret key (stored in `nextauth-secret` secret)

#### Optional Environment Variables (Future Integrations)

When you integrate with external services, add these:

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (for Stripe - public, can be env var)
- `STRIPE_SECRET_KEY` (for Stripe - should be in Secret Manager)
- `GOOGLE_CLIENT_ID` (for Google OAuth - can be env var)
- `GOOGLE_CLIENT_SECRET` (for Google OAuth - should be in Secret Manager)
- `NEXT_PUBLIC_SUPABASE_URL` (for Supabase - public, can be env var)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (for Supabase - public, can be env var)

**Security Best Practice**: Always use Secret Manager for sensitive values like API keys, database passwords, and authentication secrets.

## Alternative: Deployment to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel will automatically detect Next.js and configure the build

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Deploy:

```bash
vercel
```

3. Follow the prompts to complete deployment

Currently, no environment variables are required. When you integrate with Stripe or Supabase, you'll need to add:

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (for Stripe)
- `STRIPE_SECRET_KEY` (server-side only)
- `NEXT_PUBLIC_SUPABASE_URL` (for Supabase)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (for Supabase)

## Next Steps for Integration

### Stripe Payment Integration

1. Install Stripe packages:

```bash
npm install stripe @stripe/stripe-js
```

2. Create API routes for:
   - Creating checkout sessions (`/api/checkout`)
   - Handling webhooks (`/api/webhooks/stripe`)

3. Add Stripe Checkout buttons to product pages

4. Update the custom order form to include payment processing

### Supabase Database Integration

1. Install Supabase client:

```bash
npm install @supabase/supabase-js
```

2. Create database tables:
   - `orders` - Store custom order requests
   - `products` - Store product data (optional, if moving from static data)
   - `customers` - Store customer information

3. Update API routes:
   - `/api/custom-order/route.ts` - Save orders to Supabase
   - Create new routes for order management

4. Add authentication if needed for admin panel

### Email Integration

1. Choose an email service (Resend, SendGrid, etc.)

2. Install the service SDK

3. Update `/api/custom-order/route.ts` to send email notifications

Example with Resend:

```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from: 'orders@duckodesigns.com',
  to: siteConfig.contact.email,
  subject: `New Custom Order from ${body.name}`,
  html: formatOrderEmail(body),
})
```

## Features

- ✅ Mobile-first responsive design
- ✅ SEO optimized (metadata, OpenGraph, sitemap, robots.txt)
- ✅ JSON-LD structured data for LocalBusiness and Product
- ✅ Accessible UI components
- ✅ Custom order form with image upload
- ✅ Product gallery with image navigation
- ✅ FAQ accordion
- ✅ Policy pages
- ✅ Social media integration
- ✅ Sticky mobile CTA button

## Performance

- Image optimization with Next.js Image component
- Static generation for product pages
- Optimized bundle size with standalone output mode
- Fast page loads
- Minimal Docker container size (standalone Next.js build)
- Efficient Cloud Run cold starts

## Accessibility

- Semantic HTML
- Keyboard navigation support
- ARIA labels where needed
- Good color contrast ratios
- Screen reader friendly

## License

Private - All rights reserved

## Support

For questions or issues, contact: pharai.jo@gmail.com

