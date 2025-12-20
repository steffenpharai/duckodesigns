# Google Cloud Deployment Checklist

## Pre-Deployment Verification

### ✅ Build & TypeScript
- [x] Build completes successfully (`npm run build`)
- [x] TypeScript compilation passes (`npx tsc --noEmit`)
- [x] No linting errors
- [x] All routes properly generated (including `/admin/users`)

### ✅ Code Changes
- [x] NextAuth configured with Google OAuth only
- [x] Credentials provider removed
- [x] Registration page redirects to sign-in
- [x] Sign-in page shows only Google OAuth button
- [x] User management API routes created (`/api/users`, `/api/users/[id]`)
- [x] User management library functions created (`src/lib/users.ts`)
- [x] Admin users page created (`/admin/users`)
- [x] Admin layout updated with Users navigation link

### ✅ Configuration Files
- [x] `cloudbuild.yaml` updated with Google OAuth secrets
- [x] `Dockerfile` configured for standalone Next.js build
- [x] `next.config.js` has `output: 'standalone'`
- [x] README.md updated with Google OAuth setup instructions

## Google Cloud Setup Required

### 1. Google OAuth Credentials
- [ ] Create OAuth 2.0 Client ID in [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- [ ] Application type: Web application
- [ ] Add authorized redirect URIs:
  - `http://localhost:3000/api/auth/callback/google` (local dev)
  - `https://your-cloud-run-url.a.run.app/api/auth/callback/google` (production)
  - `https://your-domain.com/api/auth/callback/google` (if using custom domain)
- [ ] Save Client ID and Client Secret

### 2. Secret Manager Secrets
- [ ] Create `google-client-secret` secret:
  ```powershell
  echo -n "your-google-client-secret" | gcloud secrets create google-client-secret --data-file=- --project=your-project-id
  ```
- [ ] Verify existing secrets:
  - `cloud-run-database-url` (database connection string)
  - `nextauth-secret` (NextAuth.js secret)

### 3. Environment Variables
After deployment, set `GOOGLE_CLIENT_ID`:
```powershell
gcloud run services update duckodesigns \
  --region us-central1 \
  --update-env-vars="GOOGLE_CLIENT_ID=your-google-client-id" \
  --project your-project-id
```

Or set as substitution variable when triggering Cloud Build:
```powershell
gcloud builds submit --config=cloudbuild.yaml \
  --substitutions=_GOOGLE_CLIENT_ID=your-google-client-id \
  --project your-project-id
```

## Deployment Steps

### Option 1: Cloud Build (Recommended)
```powershell
# Trigger build with Google Client ID
gcloud builds submit --config=cloudbuild.yaml \
  --substitutions=_GOOGLE_CLIENT_ID=your-google-client-id \
  --project your-project-id
```

### Option 2: Manual Deployment
```powershell
# Build and push image
docker build -t gcr.io/your-project-id/duckodesigns:latest .
docker push gcr.io/your-project-id/duckodesigns:latest

# Deploy to Cloud Run
gcloud run deploy duckodesigns \
  --image gcr.io/your-project-id/duckodesigns:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --service-account duckodesigns-sa@your-project-id.iam.gserviceaccount.com \
  --add-cloudsql-instances your-project-id:us-central1:duckodesigns-db \
  --update-secrets="DATABASE_URL=cloud-run-database-url:latest,NEXTAUTH_SECRET=nextauth-secret:latest,GOOGLE_CLIENT_SECRET=google-client-secret:latest" \
  --update-env-vars="GCS_BUCKET_NAME=duckodesigns-order-images,GCS_PROJECT_ID=your-project-id,GOOGLE_CLIENT_ID=your-google-client-id" \
  --project your-project-id
```

## Post-Deployment Verification

### 1. Service Health
```powershell
# Check service status
gcloud run services describe duckodesigns --region us-central1 --format="value(status.conditions[0].status)" --project=your-project-id

# Test the service
$url = gcloud run services describe duckodesigns --region us-central1 --format="value(status.url)" --project=your-project-id
Invoke-WebRequest -Uri $url -UseBasicParsing
```

### 2. Environment Variables & Secrets
```powershell
# Verify secrets are loaded
gcloud run services describe duckodesigns --region us-central1 --format="yaml(spec.template.spec.containers[0].env)" --project=your-project-id

# Check logs for errors
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=duckodesigns AND severity>=ERROR" --limit=10 --freshness=10m --project=your-project-id
```

### 3. Authentication Testing
- [ ] Visit sign-in page: `https://your-url/auth/signin`
- [ ] Click "Sign in with Google"
- [ ] Complete Google OAuth flow
- [ ] Verify user is created in database with CUSTOMER role
- [ ] Verify session is established

### 4. Admin Panel Testing
- [ ] Manually promote a user to ADMIN role in database (or use admin panel if you have one)
- [ ] Sign in as admin user
- [ ] Navigate to `/admin/users`
- [ ] Verify user list displays correctly
- [ ] Test role update functionality
- [ ] Verify self-demotion protection works

### 5. Database Migrations
If schema changed, run migrations:
```powershell
$dbUrl = gcloud secrets versions access latest --secret=cloud-run-database-url --project=your-project-id
.\scripts\migrate.ps1 -ProjectId "your-project-id" -ConnectionName "your-project-id:us-central1:duckodesigns-db" -DatabaseUrl $dbUrl
```

## Common Issues & Solutions

### Issue: Google OAuth redirect URI mismatch
**Solution**: Ensure redirect URI in Google Cloud Console exactly matches:
- `https://your-cloud-run-url.a.run.app/api/auth/callback/google`

### Issue: "Invalid client" error
**Solution**: 
- Verify `GOOGLE_CLIENT_ID` environment variable is set
- Verify `GOOGLE_CLIENT_SECRET` secret exists and is accessible
- Check Cloud Run service account has `roles/secretmanager.secretAccessor` permission

### Issue: Users not being created
**Solution**:
- Check database connection (verify `DATABASE_URL` secret)
- Check Cloud Run logs for Prisma errors
- Verify database migrations have been run

### Issue: Admin panel not accessible
**Solution**:
- Verify user role is set to ADMIN in database
- Check middleware is properly protecting `/admin/*` routes
- Verify session is being established correctly

## Security Checklist

- [x] Google OAuth Client Secret stored in Secret Manager (not env var)
- [x] Database URL stored in Secret Manager
- [x] NextAuth secret stored in Secret Manager
- [x] Admin-only access to user management endpoints
- [x] Self-demotion protection implemented
- [x] Proper authorization checks on all API routes
- [x] Service account has minimal required permissions

## Rollback Plan

If deployment fails:
1. Revert to previous Cloud Run revision:
   ```powershell
   gcloud run services update-traffic duckodesigns \
     --to-revisions PREVIOUS_REVISION=100 \
     --region us-central1 \
     --project your-project-id
   ```
2. Or redeploy previous image tag
3. Check logs for specific errors
4. Fix issues and redeploy

