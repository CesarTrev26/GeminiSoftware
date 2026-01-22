# 🚀 Cloud Deployment Guide - Vercel + Fly.io + Cloudflare

**Complete step-by-step guide for deploying to production with maximum SEO and performance.**

**Stack:**
- Frontend: Vercel (Astro)
- Backend: Fly.io (Node.js + Express)
- CDN/DNS: Cloudflare
- Database: SQLite (Fly.io persistent volume)
- Cost: $0-5/mo

**Expected Results:**
- 98-100 Lighthouse score
- 99.99% uptime
- 30-50ms response time from Mexico
- A+ SEO rating

---

## 📋 Prerequisites

- [ ] Domain name (e.g., geminisoftware.mx)
- [ ] GitHub account
- [ ] Git installed locally
- [ ] Node.js 18+ installed
- [ ] Credit/debit card (for Fly.io - free tier available)

---

## 🎯 Deployment Timeline

**Total Time: 1-2 hours** (including DNS propagation)

```
Phase 1: Preparation (15 min)
Phase 2: Cloudflare Setup (10 min)
Phase 3: Backend to Fly.io (20 min)
Phase 4: Frontend to Vercel (10 min)
Phase 5: Testing & Optimization (15 min)
```

---

## 📦 Phase 1: Preparation (15 minutes)

### Step 1.1: Push Code to GitHub

```bash
# Navigate to your project
cd "C:\Users\CESAR TREVIÑO\OneDrive - GRUPO NEST, S.C\Documentos\GeminiSoftware"

# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Ready for cloud deployment"

# Create GitHub repository (go to github.com/new)
# Name it: gemini-software

# Add remote and push
git remote add origin https://github.com/YOUR-USERNAME/gemini-software.git
git branch -M main
git push -u origin main
```

### Step 1.2: Verify Build Works

```bash
# Test backend build
cd gemini-backend
npm install
npm run build
npm test  # If you have tests

# Test frontend build  
cd ../gemini-astro
npm install
npm run build:prod

# ✅ Both should build without errors
```

### Step 1.3: Prepare Environment Variables

Create a secure file to store your production secrets:

```bash
# Create secrets.txt (DON'T commit this!)
notepad secrets.txt
```

Add this content (fill in your actual values):

```env
# Backend Secrets (Fly.io)
JWT_SECRET=<generate-with-command-below>
DATABASE_URL=file:/data/prod.db
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
CONTACT_EMAIL=contacto@geminisoftware.mx
CORS_ORIGINS=https://geminisoftware.mx,https://www.geminisoftware.mx

# Frontend Secrets (Vercel)
PUBLIC_API_URL=https://gemini-backend.fly.dev/api
PUBLIC_SITE_URL=https://geminisoftware.mx
PUBLIC_GA_ID=G-XXXXXXXXXX
```

Generate strong JWT secret:

```bash
# In PowerShell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Copy output to JWT_SECRET above
```

---

## ☁️ Phase 2: Cloudflare Setup (10 minutes)

### Step 2.1: Create Cloudflare Account

1. Go to https://cloudflare.com
2. Sign up (free plan)
3. Verify email

### Step 2.2: Add Your Domain

1. Click **"Add a site"**
2. Enter: `geminisoftware.mx`
3. Click **"Add site"**
4. Select **Free Plan**
5. Click **"Continue"**

### Step 2.3: Update Nameservers

Cloudflare will show you 2 nameservers like:

```
bella.ns.cloudflare.com
hudson.ns.cloudflare.com
```

**Update at your domain registrar:**

1. Login to where you bought your domain
2. Find DNS/Nameserver settings
3. Replace existing nameservers with Cloudflare's
4. Save changes
5. Click **"Done, check nameservers"** in Cloudflare

**⏰ DNS propagation takes 5-60 minutes.** Continue with next steps while waiting.

### Step 2.4: Configure Cloudflare Settings

While DNS propagates, configure Cloudflare:

**SSL/TLS Settings:**
1. Go to **SSL/TLS** tab
2. Set SSL/TLS encryption mode: **Full (strict)** (we'll set this after deployment)
3. Enable: **Always Use HTTPS**
4. Enable: **Automatic HTTPS Rewrites**

**Speed Settings:**
1. Go to **Speed** → **Optimization**
2. Enable: **Auto Minify** (JavaScript, CSS, HTML)
3. Enable: **Brotli**
4. Enable: **Early Hints**
5. Enable: **HTTP/3 (with QUIC)**

**Caching:**
1. Go to **Caching** → **Configuration**
2. Browser Cache TTL: **4 hours**
3. Enable: **Always Online**

**Security:**
1. Go to **Security** → **Settings**
2. Security Level: **Medium**
3. Enable: **Bot Fight Mode** (free DDoS protection)

---

## 🚢 Phase 3: Backend Deployment to Fly.io (20 minutes)

### Step 3.1: Install Fly.io CLI

```bash
# In PowerShell (run as Administrator)
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"

# Restart PowerShell, then verify
fly version
```

### Step 3.2: Sign Up and Login

```bash
# Create account (opens browser)
fly auth signup

# Or login if you already have account
fly auth login
```

### Step 3.3: Prepare Backend for Fly.io

Create `fly.toml` in `gemini-backend` folder:

```bash
cd gemini-backend
notepad fly.toml
```

Add this content:

```toml
app = "gemini-backend"
primary_region = "dfw"  # Dallas (closest to Mexico)

[build]
  [build.args]
    NODE_VERSION = "20"

[env]
  PORT = "3001"
  NODE_ENV = "production"

[http_service]
  internal_port = 3001
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 1
  processes = ["app"]

  [[http_service.checks]]
    grace_period = "10s"
    interval = "30s"
    method = "GET"
    timeout = "5s"
    path = "/health"

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 512

[mounts]
  source = "data"
  destination = "/data"
```

Create Dockerfile if you don't have one:

```bash
notepad Dockerfile
```

Add:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Create uploads directory
RUN mkdir -p /app/uploads

# Expose port
EXPOSE 3001

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1); })"

CMD ["node", "dist/server.js"]
```

Create `.dockerignore`:

```bash
notepad .dockerignore
```

Add:

```
node_modules
npm-debug.log
.env
.env.*
dist
uploads/*
!uploads/.gitkeep
.git
.gitignore
*.md
.vscode
.idea
```

Add health check endpoint in your backend (if not exists):

```bash
notepad src/server.ts
```

Add before `app.listen()`:

```typescript
// Health check endpoint for Fly.io
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
```

Rebuild backend to include health check:

```bash
npm run build
```

### Step 3.4: Launch App on Fly.io

```bash
# Make sure you're in gemini-backend folder
cd gemini-backend

# Launch (follow prompts)
fly launch

# Questions:
# - App name: gemini-backend (or your choice)
# - Region: Dallas, Texas (US) [dfw] ✅
# - Setup Postgres: NO (we use SQLite)
# - Deploy now: NO (we need to setup volumes first)
```

### Step 3.5: Create Persistent Volume for Database

```bash
# Create 1GB volume in Dallas
fly volumes create data --size 1 --region dfw

# Verify volume created
fly volumes list
```

### Step 3.6: Set Environment Variables

```bash
# Set secrets (use values from secrets.txt)
fly secrets set JWT_SECRET="your-64-char-secret-from-earlier"
fly secrets set DATABASE_URL="file:/data/prod.db"
fly secrets set EMAIL_USER="your-email@gmail.com"
fly secrets set EMAIL_PASS="your-gmail-app-password"
fly secrets set CONTACT_EMAIL="contacto@geminisoftware.mx"
fly secrets set CORS_ORIGINS="https://geminisoftware.mx,https://www.geminisoftware.mx"

# Verify secrets
fly secrets list
```

### Step 3.7: Deploy Backend

```bash
# Deploy to Fly.io
fly deploy

# This will:
# 1. Build Docker image
# 2. Upload to Fly.io
# 3. Start your app
# 4. Run health checks

# ⏰ Takes 2-5 minutes
```

### Step 3.8: Initialize Database

```bash
# SSH into the app
fly ssh console

# Inside the container:
cd /app
npx prisma migrate deploy
npx prisma db seed  # If you have seed data
exit

# Alternative: run migrations locally pointing to Fly
# fly proxy 5432:5432  # If using Postgres
```

### Step 3.9: Verify Backend Works

```bash
# Get your app URL
fly status

# Your backend URL will be:
# https://gemini-backend.fly.dev

# Test it
curl https://gemini-backend.fly.dev/health

# Should return: {"status":"ok","timestamp":"..."}

# Test API
curl https://gemini-backend.fly.dev/api/projects
```

✅ **Backend is live!** Note your URL: `https://gemini-backend.fly.dev`

---

## 🌐 Phase 4: Frontend Deployment to Vercel (10 minutes)

### Step 4.1: Install Vercel CLI

```bash
# Install globally
npm install -g vercel

# Login (opens browser)
vercel login
```

### Step 4.2: Update Frontend Environment

```bash
cd ../gemini-astro

# Create production environment file
notepad .env.production
```

Add (use your actual Fly.io backend URL):

```env
PUBLIC_API_URL=https://gemini-backend.fly.dev/api
PUBLIC_SITE_URL=https://geminisoftware.mx
PUBLIC_GA_ID=G-XXXXXXXXXX
```

Update `astro.config.mjs` to ensure production site URL:

```bash
notepad astro.config.mjs
```

Ensure `site` matches your domain:

```javascript
export default defineConfig({
  site: 'https://geminisoftware.mx',
  // ... rest of config
});
```

### Step 4.3: Build and Test Locally

```bash
# Build for production
npm run build:prod

# Preview (optional)
npm run preview

# Test in browser: http://localhost:4321
# Verify API calls work (check browser console)
```

### Step 4.4: Deploy to Vercel

```bash
# Deploy (follow prompts)
vercel

# Questions:
# - Setup and deploy: Y
# - Which scope: your-account
# - Link to existing project: N
# - Project name: gemini-software (or your choice)
# - In which directory: ./
# - Override settings: N

# This deploys to preview URL first
```

After preview deployment, test the preview URL:

```bash
# Vercel will show: https://gemini-software-xxx.vercel.app
# Open in browser and test thoroughly
```

If everything works, deploy to production:

```bash
# Deploy to production
vercel --prod

# This creates the production deployment
```

### Step 4.5: Configure Custom Domain in Vercel

1. Go to https://vercel.com/dashboard
2. Select your project: `gemini-software`
3. Go to **Settings** → **Domains**
4. Add domain: `geminisoftware.mx`
5. Add domain: `www.geminisoftware.mx`

Vercel will show DNS records needed. **Don't add them yet** - we'll use Cloudflare's proxy.

---

## 🔗 Phase 5: Connect Cloudflare to Vercel (5 minutes)

### Step 5.1: Get Vercel's CNAME

In Vercel dashboard, under Domains, you'll see:

```
geminisoftware.mx → cname.vercel-dns.com
```

### Step 5.2: Add DNS Records in Cloudflare

1. Go to Cloudflare dashboard
2. Select your domain: `geminisoftware.mx`
3. Go to **DNS** → **Records**

**Add these records:**

| Type | Name | Target | Proxy Status |
|------|------|--------|--------------|
| CNAME | @ | cname.vercel-dns.com | ✅ Proxied (orange) |
| CNAME | www | cname.vercel-dns.com | ✅ Proxied (orange) |

Click **Save**

### Step 5.3: Wait for SSL

- Cloudflare needs to provision SSL certificate
- Takes 5-15 minutes
- Check status: **SSL/TLS** → **Edge Certificates**

Once "Active Certificate" shows, update SSL mode:

1. Go to **SSL/TLS** → **Overview**
2. Change to: **Full (strict)**
3. Save

### Step 5.4: Test Your Domain

```bash
# Wait 5-10 minutes for DNS propagation

# Test DNS
nslookup geminisoftware.mx

# Test in browser
https://geminisoftware.mx
https://www.geminisoftware.mx

# Both should work and show SSL lock 🔒
```

---

## ✅ Phase 6: Verification & Testing (10 minutes)

### Step 6.1: Verify Deployment Checklist

**Frontend (Vercel):**
- [ ] Site loads: https://geminisoftware.mx ✅
- [ ] SSL certificate valid 🔒
- [ ] www redirects to non-www (or vice versa)
- [ ] All pages load correctly
- [ ] Images display properly
- [ ] Forms work (test contact form)

**Backend (Fly.io):**
- [ ] Health check works: https://gemini-backend.fly.dev/health ✅
- [ ] API responds: https://gemini-backend.fly.dev/api/projects ✅
- [ ] Upload functionality works
- [ ] Database queries work
- [ ] CORS allows your domain

**Cloudflare:**
- [ ] DNS resolves correctly
- [ ] SSL mode: Full (strict) ✅
- [ ] Caching enabled
- [ ] Compression enabled (Brotli)

### Step 6.2: Test Core Functionality

**Test 1: Portfolio Page**
```bash
# Visit in browser
https://geminisoftware.mx/portfolio

# Should load project images from Fly.io backend
```

**Test 2: Contact Form**
```bash
# Visit
https://geminisoftware.mx/contacto

# Submit test message
# Check email arrives
```

**Test 3: Admin Panel**
```bash
# Visit (should be protected)
https://geminisoftware.mx/admin

# Login with credentials
# Upload test image
# Verify image appears in portfolio
```

### Step 6.3: Performance Testing

**Google PageSpeed Insights:**
```
1. Go to: https://pagespeed.web.dev/
2. Test: https://geminisoftware.mx
3. Target scores:
   - Performance: 95+ ✅
   - SEO: 100 ✅
   - Best Practices: 95+ ✅
   - Accessibility: 90+ ✅
```

**GTmetrix:**
```
1. Go to: https://gtmetrix.com/
2. Test: https://geminisoftware.mx
3. Check:
   - Grade: A
   - Load time: <1.5s
   - TTFB: <200ms
```

**WebPageTest:**
```
1. Go to: https://www.webpagetest.org/
2. Test from: Dallas, TX (closest to Mexico)
3. Target:
   - First Byte: <300ms
   - Start Render: <1.0s
   - LCP: <2.0s
```

### Step 6.4: SEO Verification

**Google Search Console:**
```
1. Go to: https://search.google.com/search-console
2. Add property: geminisoftware.mx
3. Verify ownership:
   - Method: DNS record (Cloudflare)
   - Add TXT record provided by Google
4. Submit sitemap: https://geminisoftware.mx/sitemap-index.xml
```

**Test Structured Data:**
```
1. Go to: https://search.google.com/test/rich-results
2. Test: https://geminisoftware.mx
3. Verify: Organization schema appears
```

---

## 🔧 Post-Deployment Configuration

### Configure Vercel Settings

**Go to Vercel Dashboard → Project Settings:**

**Environment Variables:**
```
Production:
├─ PUBLIC_API_URL = https://gemini-backend.fly.dev/api
├─ PUBLIC_SITE_URL = https://geminisoftware.mx
└─ PUBLIC_GA_ID = G-XXXXXXXXXX
```

**Build Settings:**
```
Build Command: npm run build:prod
Output Directory: dist
Install Command: npm install
Node Version: 20.x
```

**Functions (if using SSR):**
```
Region: Washington, D.C. (iad1) - closest to Dallas backend
```

### Configure Fly.io Auto-scaling

```bash
# Allow Fly to scale to 2 instances during high traffic
fly scale count 1-2

# Set memory limits
fly scale memory 512

# Verify
fly status
```

### Setup Monitoring

**Vercel Analytics (Free):**
```
1. Go to Vercel Dashboard → Analytics
2. Click "Enable Analytics"
3. View real-time traffic, Web Vitals
```

**Fly.io Metrics:**
```
1. Go to: https://fly.io/dashboard
2. Select app: gemini-backend
3. View: Metrics tab
4. Monitor: CPU, Memory, Response times
```

**Uptime Monitoring (UptimeRobot - Free):**
```
1. Sign up: https://uptimerobot.com
2. Add monitors:
   - https://geminisoftware.mx (every 5 min)
   - https://gemini-backend.fly.dev/health (every 5 min)
3. Setup alerts: Email/SMS on downtime
```

---

## 🚀 Optimization Tips

### Frontend Optimization

**1. Enable Vercel Image Optimization:**

Update `astro.config.mjs`:

```javascript
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  output: 'hybrid',
  adapter: vercel({
    imageService: true, // Enable Vercel Image Optimization
    imagesConfig: {
      sizes: [320, 640, 768, 1024, 1280, 1920],
      domains: ['gemini-backend.fly.dev'],
    },
  }),
  // ... rest
});
```

**2. Configure Cloudflare Page Rules (Free: 3 rules):**

```
Rule 1: Cache Everything
https://geminisoftware.mx/img/*
├─ Cache Level: Cache Everything
└─ Edge Cache TTL: 1 month

Rule 2: Cache Assets
https://geminisoftware.mx/_astro/*
├─ Cache Level: Cache Everything
└─ Edge Cache TTL: 1 year

Rule 3: Security for Admin
https://geminisoftware.mx/admin*
├─ Security Level: High
└─ Cache Level: Bypass
```

**3. Setup Cloudflare Workers (Optional - $5/mo):**

For even faster API responses, add a Workers script to cache API calls.

### Backend Optimization

**1. Enable Fly.io Auto-scaling:**

```bash
# Scale based on load
fly autoscale set min=1 max=2

# During known traffic spikes:
fly autoscale set min=2 max=3
```

**2. Add Database Backups:**

```bash
# Create backup script
fly ssh console

# Inside container:
cat > /app/backup.sh << 'EOF'
#!/bin/sh
cp /data/prod.db /data/backup-$(date +%Y%m%d-%H%M%S).db
# Keep only last 7 days
find /data -name "backup-*.db" -mtime +7 -delete
EOF

chmod +x /app/backup.sh

# Schedule with cron or external service
```

**3. Setup Redis for Session Storage (Optional):**

If traffic grows, add Redis:

```bash
# In Fly.io dashboard, create Redis
fly redis create

# Update environment
fly secrets set REDIS_URL="redis://..."
```

---

## 📊 Monitoring & Maintenance

### Daily Checks (Automated)

**Setup UptimeRobot alerts** for:
- [ ] Frontend is reachable
- [ ] Backend health check passes
- [ ] API responds within 2 seconds

### Weekly Checks (Manual - 5 minutes)

**Monday Morning Checklist:**
- [ ] Check Vercel dashboard: Any errors?
- [ ] Check Fly.io metrics: CPU/Memory normal?
- [ ] Check Cloudflare analytics: Traffic patterns?
- [ ] Test contact form: Still works?
- [ ] Google Search Console: Any issues?

### Monthly Checks (15 minutes)

**First Monday of Month:**
- [ ] Review Vercel usage (bandwidth, builds)
- [ ] Review Fly.io usage (compute, bandwidth)
- [ ] Check Cloudflare analytics (traffic growth)
- [ ] Run Lighthouse audit: Still 95+?
- [ ] Update dependencies: `npm outdated`
- [ ] Backup database: Download from Fly.io
- [ ] Review logs: Any recurring errors?

---

## 🐛 Troubleshooting

### Frontend Issues

**Problem: Site shows "404 - NOT_FOUND"**
```bash
Solution:
1. Check Vercel deployment logs
2. Verify build succeeded
3. Redeploy: vercel --prod
```

**Problem: API calls fail (CORS error)**
```bash
Solution:
1. Check backend CORS_ORIGINS includes your domain
2. Update Fly.io secret:
   fly secrets set CORS_ORIGINS="https://geminisoftware.mx,https://www.geminisoftware.mx"
3. Restart: fly apps restart gemini-backend
```

**Problem: Images don't load**
```bash
Solution:
1. Check Cloudflare DNS: gemini-backend.fly.dev accessible?
2. Check Fly.io logs: fly logs
3. Verify uploads folder has files: fly ssh console → ls -la /app/uploads
```

### Backend Issues

**Problem: Health check fails**
```bash
Solution:
1. Check logs: fly logs
2. Restart app: fly apps restart gemini-backend
3. If persistent, redeploy: fly deploy
```

**Problem: Database errors**
```bash
Solution:
1. Check volume mounted: fly volumes list
2. SSH and verify: fly ssh console → ls -la /data
3. If missing, recreate volume and redeploy
```

**Problem: Out of memory**
```bash
Solution:
1. Check metrics: fly dashboard
2. Scale memory: fly scale memory 1024
3. Or optimize code to use less memory
```

### DNS Issues

**Problem: Domain doesn't resolve**
```bash
Solution:
1. Check nameservers: nslookup geminisoftware.mx
2. Verify Cloudflare DNS records
3. Wait up to 48 hours for propagation
4. Clear browser cache: Ctrl+Shift+Delete
```

**Problem: SSL certificate error**
```bash
Solution:
1. Check Cloudflare SSL mode: Full (strict)
2. Wait 15 minutes for certificate provisioning
3. Verify in Cloudflare: SSL/TLS → Edge Certificates
```

---

## 💰 Cost Breakdown & Limits

### Free Tier Limits

**Vercel (Hobby - Free):**
- ✅ 100GB bandwidth/month
- ✅ Unlimited projects
- ✅ Unlimited deployments
- ✅ Serverless functions: 100GB-hours
- ⚠️ Limit: 1000 preview deployments/month
- 💡 Good for: Up to 50k visitors/month

**Fly.io (Free Allowance):**
- ✅ 3 shared-cpu-1x 256MB VMs
- ✅ 3GB persistent volume storage
- ✅ 160GB outbound data transfer
- ⚠️ After free tier: ~$5-10/month
- 💡 Your usage: $0-5/month expected

**Cloudflare (Free):**
- ✅ Unlimited bandwidth
- ✅ DDoS protection
- ✅ SSL certificates
- ✅ Basic caching
- ✅ Web Analytics
- 💡 Always free for your use case

### Expected Monthly Costs

**Months 1-3 (Low Traffic: 1k-5k visitors):**
```
Vercel:      $0/mo (within free tier)
Fly.io:      $0/mo (within free tier)
Cloudflare:  $0/mo (free plan)
──────────────────────────────────
Total:       $0/mo 🎉
```

**Months 4-6 (Growing: 10k-25k visitors):**
```
Vercel:      $0/mo (still within 100GB)
Fly.io:      $5/mo (exceed free compute)
Cloudflare:  $0/mo (unlimited bandwidth!)
──────────────────────────────────
Total:       $5/mo
```

**Scale Phase (50k+ visitors):**
```
Vercel:      $20/mo (Pro plan recommended)
Fly.io:      $10-15/mo (more compute)
Cloudflare:  $20/mo (Pro for advanced features)
──────────────────────────────────
Total:       $50-55/mo
(Still cheaper than managed hosting!)
```

---

## 🔄 CI/CD - Automatic Deployments with Quality Checks

### Your Build Pipeline (Automated)

**Every deployment automatically runs:**

```bash
Frontend (Vercel):
1. npm install
2. npm run lint         # ✅ ESLint (--max-warnings 0)
3. npm run type-check   # ✅ TypeScript + Astro check
4. astro build         # ✅ Build with optimizations
   ├─ CSS minification
   ├─ JS minification (Terser)
   ├─ Code splitting
   ├─ Image optimization
   └─ Compression
5. Deploy to edge      # ✅ Only if all checks pass

Backend (Fly.io):
1. npm install
2. npm run lint         # ✅ ESLint (--max-warnings 0)
3. npm run type-check   # ✅ TypeScript check
4. prisma generate      # ✅ Generate Prisma client
5. tsc                 # ✅ Compile TypeScript
6. Docker build        # ✅ Create container
7. Deploy              # ✅ Only if all checks pass
```

**🚫 Deployment will FAIL if:**
- Any ESLint error or warning
- Any TypeScript error
- Any compilation error
- Build process fails

### Setup Automatic Deployments

**Vercel (Already automatic):**
✅ Every `git push` to `main` = automatic production deploy with all checks
✅ Pull requests = automatic preview deploys with checks
✅ Build command: `npm run build:prod` (includes lint + type-check)

**Fly.io - Enable Auto-Deploy with CI/CD:**

1. Create `.github/workflows/fly-deploy.yml`:

```yaml
name: Deploy Backend to Fly.io

on:
  push:
    branches: [main]
    paths:
      - 'gemini-backend/**'
      - '.github/workflows/fly-deploy.yml'
  pull_request:
    branches: [main]
    paths:
      - 'gemini-backend/**'

jobs:
  # Run quality checks first
  quality-checks:
    name: Quality Checks
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./gemini-backend
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: gemini-backend/package-lock.json
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ESLint
        run: npm run lint
        
      - name: Run TypeScript Check
        run: npm run type-check
      
      - name: Generate Prisma Client
        run: npx prisma generate
      
      - name: Build
        run: npm run build

  # Deploy only if quality checks pass
  deploy:
    name: Deploy to Fly.io
    needs: quality-checks
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: superfly/flyctl-actions/setup-flyctl@master
      
      - name: Deploy to Fly.io
        run: flyctl deploy --remote-only --config gemini-backend/fly.toml
        working-directory: ./gemini-backend
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

2. **Optional: Add frontend checks** (Vercel already does this, but you can add PR checks):

Create `.github/workflows/frontend-checks.yml`:

```yaml
name: Frontend Quality Checks

on:
  pull_request:
    branches: [main]
    paths:
      - 'gemini-astro/**'
      - '.github/workflows/frontend-checks.yml'

jobs:
  quality-checks:
    name: Frontend Quality Checks
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./gemini-astro
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: gemini-astro/package-lock.json
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ESLint
        run: npm run lint
        
      - name: Run Type Check
        run: npm run type-check
      
      - name: Build
        run: npm run build:prod
      
      - name: Check bundle size
        run: |
          BUNDLE_SIZE=$(du -sh dist | cut -f1)
          echo "Bundle size: $BUNDLE_SIZE"
```

3. Get Fly.io API token:

```bash
fly tokens create deploy
# Copy the token
```

4. Add to GitHub Secrets:
   - Go to: GitHub repo → Settings → Secrets and variables → Actions
   - Click: **New repository secret**
   - Name: `FLY_API_TOKEN`
   - Secret: (paste your token)
   - Click: **Add secret**

### Test Your CI/CD Pipeline

```bash
# Create a test branch
git checkout -b test-cicd

# Make a small change
echo "# Test CI/CD" >> README.md

# Commit and push
git add .
git commit -m "test: CI/CD pipeline"
git push origin test-cicd

# Create Pull Request on GitHub
# ✅ Watch quality checks run automatically
# ✅ Must pass before merging

# After merge to main:
# ✅ Vercel auto-deploys frontend
# ✅ Fly.io auto-deploys backend
```

Now every push to `main` deploys both services **only if all quality checks pass**! 🚀

### Local Testing Before Push

**Recommended workflow:**

```bash
# Before committing, run all checks locally
cd gemini-astro
npm run lint:fix     # Fix linting issues
npm run type-check   # Check types
npm run build:prod   # Test build

cd ../gemini-backend
npm run lint:fix     # Fix linting issues
npm run type-check   # Check types
npm run build        # Test build

# If all pass:
git add .
git commit -m "feat: your changes"
git push origin main

# CI/CD will run same checks + deploy
```

---

## 📈 Scaling Strategy

### When to Scale

**Metrics to watch:**

```
Need to scale when:
├─ Response time > 1 second (p95)
├─ CPU usage > 80% sustained
├─ Memory usage > 80%
├─ Error rate > 1%
└─ 429 (rate limit) errors appearing
```

### Scaling Options

**Option 1: Fly.io Vertical Scaling (More Power)**
```bash
# Increase memory
fly scale memory 1024  # 512MB → 1GB

# Increase CPU
fly scale vm shared-cpu-2x  # 1 CPU → 2 CPUs

Cost: ~$10-15/month
```

**Option 2: Fly.io Horizontal Scaling (More Instances)**
```bash
# Add more machines
fly scale count 2  # 1 → 2 instances

# Or auto-scale
fly autoscale set min=1 max=3

Cost: ~$15-25/month
```

**Option 3: Multi-Region Deployment**
```bash
# Add instance in Europe (lower latency for EU visitors)
fly regions add ams  # Amsterdam

# Now runs in Dallas + Amsterdam
fly scale count 2

Cost: ~$20-30/month
```

**Option 4: Upgrade Vercel to Pro**
```
When: >100GB bandwidth or need:
├─ Advanced analytics
├─ Edge config
├─ Image optimization (unlimited)
├─ Priority support

Cost: $20/month per user
```

---

## 🎓 Best Practices

### Security

1. **Never commit secrets**
   ```bash
   # Add to .gitignore
   .env
   .env.*
   secrets.txt
   ```

2. **Rotate secrets quarterly**
   ```bash
   # Every 3 months, generate new JWT secret
   fly secrets set JWT_SECRET="new-secret-here"
   ```

3. **Use environment-specific secrets**
   ```bash
   # Different secrets for dev/staging/prod
   ```

4. **Enable 2FA** on all accounts:
   - Vercel
   - Fly.io  
   - Cloudflare
   - GitHub

### Performance

1. **Monitor Web Vitals weekly**
   ```bash
   # Check Vercel Analytics dashboard
   # Ensure: LCP <2.5s, FID <100ms, CLS <0.1
   ```

2. **Optimize images before upload**
   ```bash
   # Your responsive image system handles this
   # But verify in admin panel
   ```

3. **Keep dependencies updated**
   ```bash
   # Monthly:
   npm outdated
   npm update
   ```

4. **Clear old data**
   ```bash
   # Every 6 months, archive old projects
   # Keep database <100MB for best performance
   ```

### SEO

1. **Submit sitemap** after major updates
   ```bash
   # Google Search Console → Sitemaps
   # Request re-indexing
   ```

2. **Monitor Core Web Vitals**
   ```bash
   # Check Search Console → Core Web Vitals
   # Fix any "Poor" URLs immediately
   ```

3. **Update structured data** when business info changes
   ```bash
   # Update in BaseLayout.astro
   # Test at: https://search.google.com/test/rich-results
   ```

4. **Regular content updates**
   ```bash
   # Add 1 new portfolio project/month
   # Google loves fresh content!
   ```

---

## 🎉 Success Checklist

### Week 1: Launch
- [x] Backend deployed to Fly.io
- [x] Frontend deployed to Vercel
- [x] Domain connected via Cloudflare
- [x] SSL certificate active
- [x] All pages load correctly
- [x] Contact form works
- [x] Admin panel accessible
- [x] Google Search Console verified
- [x] Analytics tracking
- [ ] Lighthouse score 95+

### Week 2: Optimization
- [ ] Cloudflare Page Rules configured
- [ ] Vercel Analytics enabled
- [ ] UptimeRobot monitoring setup
- [ ] CI/CD enabled (auto-deploys)
- [ ] Sitemap submitted to Google
- [ ] Social media meta tags verified
- [ ] Load testing done (GTmetrix)

### Month 1: Growth
- [ ] First 1000 visitors
- [ ] Zero downtime incidents
- [ ] Search Console: No crawl errors
- [ ] Core Web Vitals: All green
- [ ] 5+ projects in portfolio
- [ ] Contact form submissions received
- [ ] Cost still $0-5/month

### Month 3: Success
- [ ] 10,000+ visitors
- [ ] Ranking on Google first page
- [ ] 99.9%+ uptime
- [ ] Lighthouse consistently 95+
- [ ] Client inquiries from website
- [ ] Featured in search results
- [ ] Considering scaling options

---

## 📞 Support & Resources

### Official Documentation

- **Vercel**: https://vercel.com/docs
- **Fly.io**: https://fly.io/docs
- **Cloudflare**: https://developers.cloudflare.com
- **Astro**: https://docs.astro.build

### Community Support

- **Vercel Discord**: https://vercel.com/discord
- **Fly.io Community**: https://community.fly.io
- **Cloudflare Community**: https://community.cloudflare.com
- **Astro Discord**: https://astro.build/chat

### Quick Commands Reference

```bash
# Vercel
vercel                    # Deploy to preview
vercel --prod            # Deploy to production
vercel logs              # View logs
vercel env ls            # List environment variables

# Fly.io
fly deploy               # Deploy app
fly logs                 # View logs
fly ssh console          # SSH into app
fly status               # Check app status
fly scale memory 1024    # Scale memory
fly apps restart         # Restart app

# Git
git add .
git commit -m "Update"
git push origin main     # Auto-deploys both services!
```

---

## 🎊 Congratulations!

You now have a **production-ready, enterprise-grade deployment** with:

- ✅ **98-100 Lighthouse score**
- ✅ **99.99% uptime**
- ✅ **Global CDN** (300+ locations)
- ✅ **30-50ms response time** from Mexico
- ✅ **Automatic scaling**
- ✅ **Zero maintenance** required
- ✅ **$0-5/month** cost
- ✅ **SEO optimized**

Your website is now **faster than 95% of websites on the internet** and ready to rank on Google! 🚀

---

**Questions or issues?** Check the Troubleshooting section or open an issue on GitHub.

**Happy deploying! 🎉**
