# Ducko Designs Website

A modern, production-ready website for Ducko Designs - a family-owned toddler clothing brand specializing in custom car seat-friendly ponchos.

## Tech Stack

- **Next.js 14+** with App Router
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **shadcn/ui** for accessible UI components
- **Vercel-ready** for deployment

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
- `category`: "poncho" or "accessory"
- `featured`: Boolean for featured products
- `fabricOptions`: Array of available fabric options
- `sizes`: Optional array of available sizes

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

## Deployment to Vercel

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

### Environment Variables

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
- Optimized bundle size
- Fast page loads

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

