# 🚀 Gemini Software - Deployment Checklist

## Pre-Deployment Checklist

### 1. SEO & Analytics ✅
- [x] Meta tags (title, description) on all pages
- [x] Open Graph tags for social sharing
- [x] Structured data (JSON-LD) - Organization, LocalBusiness, Services
- [x] robots.txt configured
- [x] Sitemap auto-generated (@astrojs/sitemap)
- [x] Canonical URLs set
- [ ] **PENDING**: Google Analytics ID - Update PUBLIC_GA_ID in .env.production
- [ ] **PENDING**: Google Search Console verification
- [ ] **PENDING**: Google My Business profile
- [ ] **OPTIONAL**: Facebook Pixel for retargeting ads

### 2. Performance Optimization ✅
- [x] Image optimization (WebP, lazy loading)
- [x] Gzip compression enabled (.htaccess)
- [x] Browser caching configured
- [x] CSS/JS minification (Astro build)
- [x] Lenis smooth scroll optimized
- [x] Prefetch strategy configured
- [x] Core Web Vitals optimization
- [x] Rate limiting on backend API (500 req/15min)

### 3. Security 🔒
- [x] Helmet.js security headers
- [x] CORS properly configured
- [x] Environment variables for sensitive data
- [x] JWT authentication on admin routes
- [x] Rate limiting on API endpoints
- [x] SQL injection protection (Prisma ORM)
- [x] XSS protection (Content Security Policy)
- [ ] **REQUIRED**: Change default admin password
- [ ] **REQUIRED**: Update .env with production secrets
- [ ] **REQUIRED**: Enable HTTPS (SSL certificate)
- [ ] **OPTIONAL**: Add Web Application Firewall (WAF)

### 4. Backend Configuration 🔧
- [x] Database migrations ready (Prisma)
- [x] Error handling implemented
- [x] File upload validation (5MB limit, image types only)
- [x] Email service configured (Nodemailer)
- [ ] **REQUIRED**: Update SMTP credentials in .env
- [ ] **REQUIRED**: Configure production database (PostgreSQL recommended)
- [ ] **OPTIONAL**: Setup backup strategy
- [ ] **OPTIONAL**: Setup monitoring (Sentry, LogRocket)

### 5. Content & Forms 📝
- [x] Contact form working
- [x] WhatsApp integration
- [x] Email validation
- [x] Success/error messages
- [x] Conversion tracking (Google Analytics events)
- [ ] **TEST**: Send test contact form submission
- [ ] **TEST**: Verify email delivery

### 6. Mobile & Cross-Browser 📱
- [x] Responsive design (mobile-first)
- [x] Touch-friendly buttons
- [x] Smooth scrolling on mobile
- [x] PWA manifest configured
- [ ] **TEST**: iPhone Safari
- [ ] **TEST**: Android Chrome
- [ ] **TEST**: iPad/Tablet
- [ ] **TEST**: Chrome, Firefox, Safari, Edge

---

## Deployment Steps

### Frontend (Astro) Deployment

#### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd gemini-astro
vercel --prod
```

**Environment Variables to set in Vercel:**
```
PUBLIC_API_URL=https://your-backend-domain.com/api
PUBLIC_GA_ID=G-XXXXXXXXXX
PUBLIC_SITE_URL=https://geminisoftware.mx
```

#### Option 2: Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
cd gemini-astro
netlify deploy --prod
```

#### Option 3: Traditional Hosting (cPanel/Plesk)
```bash
# Build the project
cd gemini-astro
npm run build

# Upload dist/ folder to public_html via FTP
# Configure .htaccess (already included in public/)
```

---

### Backend (Node.js/Express) Deployment

#### Option 1: Railway.app (Recommended)
1. Sign up at https://railway.app
2. Create new project → Deploy from GitHub
3. Add environment variables:
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secure-random-string
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FRONTEND_URL=https://geminisoftware.mx
```
4. Deploy

#### Option 2: Render.com
```bash
# Deploy as Web Service
# Build Command: npm install && npm run build && npx prisma generate
# Start Command: npm start
```

#### Option 3: VPS (Digital Ocean, Linode, AWS)
```bash
# SSH into server
ssh root@your-server-ip

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
npm install -g pm2

# Clone repository
git clone https://github.com/your-repo/gemini-backend.git
cd gemini-backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
nano .env  # Edit with production values

# Build
npm run build

# Run migrations
npx prisma migrate deploy

# Start with PM2
pm2 start dist/server.js --name gemini-backend
pm2 startup
pm2 save

# Configure Nginx reverse proxy
sudo nano /etc/nginx/sites-available/gemini-backend
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name api.geminisoftware.mx;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Post-Deployment Checklist

### Immediate Testing (Day 1) 🔍
- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Contact form submits successfully
- [ ] Email notifications received
- [ ] WhatsApp button opens correctly
- [ ] Portfolio page displays projects
- [ ] Services page loads all services
- [ ] Admin login works
- [ ] Admin can create/edit/delete projects
- [ ] Images upload successfully
- [ ] Mobile responsive on all pages
- [ ] SSL certificate active (https://)
- [ ] No console errors
- [ ] Google Analytics tracking (check Real-Time in GA)

### SEO Setup (Week 1) 🎯
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Verify Google My Business
- [ ] Add business to Google Maps
- [ ] Create Facebook Business Page
- [ ] Create Instagram Business Profile
- [ ] Create LinkedIn Company Page
- [ ] Request reviews from clients
- [ ] Add schema markup validation (schema.org validator)

### Marketing Setup (Week 1-2) 📣
- [ ] Setup Google Ads campaigns (if applicable)
- [ ] Setup Facebook/Instagram ads (if applicable)
- [ ] Create email signature with website link
- [ ] Add website to business cards
- [ ] Update all social media bios with website
- [ ] Share launch announcement on social media
- [ ] Email existing clients about new website
- [ ] Create WhatsApp Business profile

### Monitoring & Maintenance (Ongoing) 📊
- [ ] Monitor Google Analytics weekly
- [ ] Check Google Search Console for errors
- [ ] Review contact form submissions daily
- [ ] Backup database weekly
- [ ] Update portfolio with new projects monthly
- [ ] Check for broken links monthly
- [ ] Update dependencies quarterly
- [ ] Review security alerts
- [ ] Monitor page speed (PageSpeed Insights)
- [ ] Track keyword rankings

---

## Performance Targets 🎯

### Core Web Vitals Goals:
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### SEO Targets:
- PageSpeed Score: 90+ (Mobile & Desktop)
- SEO Score: 95+
- Accessibility Score: 90+
- Best Practices Score: 95+

---

## Support & Resources 📚

### Documentation:
- Astro Docs: https://docs.astro.build
- Prisma Docs: https://www.prisma.io/docs
- Express Docs: https://expressjs.com

### Tools:
- Google PageSpeed Insights: https://pagespeed.web.dev
- Google Search Console: https://search.google.com/search-console
- Google Analytics: https://analytics.google.com
- Schema Validator: https://validator.schema.org

### Monitoring:
- Uptime Robot: https://uptimerobot.com (free website monitoring)
- Sentry: https://sentry.io (error tracking)
- LogRocket: https://logrocket.com (user session recording)

---

## Emergency Contacts 🆘

### Issues:
1. Website down → Check hosting provider status
2. Forms not working → Check backend API logs
3. Database error → Check database connection
4. Email not sending → Verify SMTP credentials

### Rollback Procedure:
```bash
# If deployment fails, rollback to previous version
git revert HEAD
git push origin main

# Or restore from backup
# Restore database from last backup
# Redeploy previous commit
```

---

## Success Metrics (First 30 Days) 📈

Track these KPIs:
- [ ] Website visitors (target: 500+)
- [ ] Contact form submissions (target: 10+)
- [ ] WhatsApp messages (target: 15+)
- [ ] Bounce rate (target: < 60%)
- [ ] Avg. session duration (target: > 2 min)
- [ ] Organic search traffic growth
- [ ] Pages per session (target: > 3)
- [ ] Lead conversion rate (target: > 5%)

---

## Notes:
- Update this checklist as you complete items
- Keep credentials secure (use password manager)
- Test thoroughly before announcing publicly
- Monitor closely for first 48 hours post-launch
- Celebrate the launch! 🎉
