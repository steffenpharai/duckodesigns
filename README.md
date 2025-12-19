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

**Google Cloud Run**: ✅ Ready for deployment
- Cloud Build configuration (`cloudbuild.yaml`) configured
- Multi-stage Dockerfile optimized for production
- Standalone Next.js output for minimal container size
- Automated IAM permissions and service account setup
- PowerShell deployment scripts for Windows

**Key Features**:
- Automated builds on code push (via Cloud Build triggers)
- Manual deployment via PowerShell scripts
- Public access configured
- Auto-scaling (0-10 instances)
- Production-optimized settings (512Mi memory, 1 CPU, 300s timeout)

### 📋 Next Steps
- Set up Cloud Build trigger for automated deployments
- Configure custom domain (if needed)
- Add environment variables for future integrations (Stripe, Supabase, etc.)

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
- Configure IAM permissions for Cloud Build service account
- Create Cloud Run service account (optional, for fine-grained permissions)
- Configure Docker authentication for Container Registry

**Note**: You'll need to enable billing manually in the Google Cloud Console if the project is new. The script will prompt you to do this.

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

#### Option 2: Manual Deployment via PowerShell Script

Deploy manually using the provided PowerShell script:

```powershell
# Using Cloud Build (recommended)
.\scripts\deploy.ps1 -ProjectId "your-project-id" -UseCloudBuild

# Or build locally and deploy
.\scripts\deploy.ps1 -ProjectId "your-project-id" -Region "us-central1"
```

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

### Managing Environment Variables

Set environment variables for your Cloud Run service:

```powershell
gcloud run services update duckodesigns `
  --region us-central1 `
  --update-env-vars "KEY1=VALUE1,KEY2=VALUE2" `
  --project your-project-id
```

### Viewing Logs

```powershell
gcloud run services logs read duckodesigns --region us-central1 --project your-project-id
```

### Custom Domain Setup

1. **Map custom domain**:

```powershell
gcloud run domain-mappings create `
  --service duckodesigns `
  --domain yourdomain.com `
  --region us-central1 `
  --project your-project-id
```

2. **Update DNS records** as instructed by the command output

### Monitoring and Management

- **Cloud Console**: [console.cloud.google.com/run](https://console.cloud.google.com/run)
- **Cloud Build History**: [console.cloud.google.com/cloud-build](https://console.cloud.google.com/cloud-build)
- **Logs**: [console.cloud.google.com/logs](https://console.cloud.google.com/logs)
- **Service URL**: Retrieved automatically after deployment via `deploy.ps1` script

### Quick Deployment Commands

```powershell
# One-time setup
.\scripts\setup-gcp.ps1 -ProjectId "your-project-id" -Region "us-central1"

# Deploy using Cloud Build (recommended)
.\scripts\deploy.ps1 -ProjectId "your-project-id" -UseCloudBuild

# Deploy with local Docker build
.\scripts\deploy.ps1 -ProjectId "your-project-id" -Region "us-central1"

# View service URL
gcloud run services describe duckodesigns --region us-central1 --format="value(status.url)" --project=your-project-id
```

### Environment Variables

Currently, no environment variables are required. When you integrate with Stripe or Supabase, you'll need to add:

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (for Stripe)
- `STRIPE_SECRET_KEY` (server-side only)
- `NEXT_PUBLIC_SUPABASE_URL` (for Supabase)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (for Supabase)

Set these using the environment variable management commands above.

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

