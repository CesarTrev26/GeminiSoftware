# 🚀 Production Deployment Guide - Gemini Software

Complete guide for deploying to production with maximum speed and SEO optimization.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Server Setup](#server-setup)
3. [SSL/HTTPS Configuration](#ssl-configuration)
4. [Database Setup](#database-setup)
5. [Application Deployment](#application-deployment)
6. [Nginx Configuration](#nginx-configuration)
7. [PM2 Process Management](#pm2-process-management)
8. [CDN & Caching](#cdn--caching)
9. [SEO Optimization](#seo-optimization)
10. [Monitoring & Maintenance](#monitoring--maintenance)
11. [Performance Checklist](#performance-checklist)

---

## Prerequisites

### Server Requirements

- **OS**: Ubuntu 22.04 LTS (recommended) or similar
- **RAM**: Minimum 2GB (4GB recommended)
- **CPU**: 2+ cores
- **Disk**: 20GB+ SSD
- **Node.js**: v18.x or v20.x LTS
- **Nginx**: Latest stable
- **PM2**: Global installation

### Domain Setup

1. **DNS Configuration**:
   ```
   A Record:     geminisoftware.mx → Your_Server_IP
   A Record:     www.geminisoftware.mx → Your_Server_IP
   CNAME:        api.geminisoftware.mx → geminisoftware.mx
   ```

2. **Verify DNS**:
   ```bash
   dig geminisoftware.mx +short
   dig www.geminisoftware.mx +short
   ```

---

## Server Setup

### 1. Initial Server Configuration

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git build-essential

# Install Node.js (v20 LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version

# Install PM2 globally
sudo npm install -g pm2

# Setup PM2 startup script
pm2 startup
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME
```

### 2. Create Application User

```bash
# Create dedicated user for security
sudo adduser --disabled-password --gecos "" gemini
sudo usermod -aG sudo gemini

# Switch to gemini user
sudo su - gemini
```

### 3. Clone Repository

```bash
# Create application directory
mkdir -p ~/apps
cd ~/apps

# Clone your repository
git clone https://github.com/your-username/gemini-software.git
cd gemini-software

# Or upload files via SCP/SFTP
```

---

## SSL Configuration

### Using Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Stop Nginx temporarily
sudo systemctl stop nginx

# Obtain certificate
sudo certbot certonly --standalone -d geminisoftware.mx -d www.geminisoftware.mx

# Setup auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Verify auto-renewal
sudo certbot renew --dry-run
```

### Certificate Locations

```
Certificate: /etc/letsencrypt/live/geminisoftware.mx/fullchain.pem
Private Key: /etc/letsencrypt/live/geminisoftware.mx/privkey.pem
Chain:       /etc/letsencrypt/live/geminisoftware.mx/chain.pem
```

---

## Database Setup

### 1. Configure Production Database

```bash
cd ~/apps/gemini-software/gemini-backend

# Copy environment file
cp .env.production.example .env.production

# Edit with production values
nano .env.production
```

**Important Settings**:
```env
NODE_ENV=production
DATABASE_URL="file:./prod.db"
JWT_SECRET=<generate-strong-secret>
CORS_ORIGINS=https://geminisoftware.mx,https://www.geminisoftware.mx
```

### 2. Generate JWT Secret

```bash
# Generate secure secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Run Migrations

```bash
cd ~/apps/gemini-software/gemini-backend

# Install dependencies
npm ci --production=false

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed initial data (if needed)
# npx prisma db seed
```

---

## Application Deployment

### 1. Configure Environment Variables

**Backend** (`gemini-backend/.env.production`):
```env
NODE_ENV=production
PORT=3001
DATABASE_URL="file:./prod.db"
JWT_SECRET=your-generated-secret
JWT_EXPIRES_IN=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
CONTACT_EMAIL=contacto@geminisoftware.mx
CORS_ORIGINS=https://geminisoftware.mx,https://www.geminisoftware.mx
```

**Frontend** (`gemini-astro/.env.production`):
```env
PUBLIC_API_URL=https://geminisoftware.mx/api
PUBLIC_SITE_URL=https://geminisoftware.mx
PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 2. Run Deployment Script

```bash
cd ~/apps/gemini-software

# Make script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

**Or manually**:

```bash
# Backend
cd gemini-backend
npm ci --production=false
npx prisma generate
npm run build

# Frontend
cd ../gemini-astro
npm ci --production=false
npm run build:prod

# Start with PM2
cd ..
pm2 start ecosystem.config.js --env production
pm2 save
```

---

## Nginx Configuration

### 1. Install Nginx

```bash
sudo apt install -y nginx
```

### 2. Configure Site

```bash
# Copy provided nginx.conf
sudo cp nginx.conf /etc/nginx/sites-available/geminisoftware.mx

# Edit paths (replace /path/to/ with actual paths)
sudo nano /etc/nginx/sites-available/geminisoftware.mx

# Update these lines:
# alias /home/gemini/apps/gemini-software/gemini-backend/uploads/;
# root /home/gemini/apps/gemini-software/gemini-astro/dist/client;

# Enable site
sudo ln -s /etc/nginx/sites-available/geminisoftware.mx /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### 3. Verify

```bash
# Check Nginx status
sudo systemctl status nginx

# Test HTTP to HTTPS redirect
curl -I http://geminisoftware.mx

# Test HTTPS
curl -I https://geminisoftware.mx
```

---

## PM2 Process Management

### Basic Commands

```bash
# Status
pm2 status

# Logs
pm2 logs                    # All logs
pm2 logs gemini-backend     # Backend only
pm2 logs gemini-frontend    # Frontend only

# Restart
pm2 restart all
pm2 restart gemini-backend
pm2 restart gemini-frontend

# Stop
pm2 stop all

# Delete
pm2 delete all
pm2 delete gemini-backend

# Save configuration
pm2 save

# Monitor in real-time
pm2 monit
```

### Advanced Monitoring

```bash
# Install PM2 monitoring (optional)
pm2 install pm2-logrotate

# Configure log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
```

---

## CDN & Caching

### 1. Cloudflare Setup (Recommended - Free)

1. **Sign up**: https://cloudflare.com
2. **Add site**: geminisoftware.mx
3. **Update nameservers** at your domain registrar
4. **SSL/TLS**: Set to "Full (strict)"
5. **Page Rules**:
   ```
   *geminisoftware.mx/img/*
   - Cache Level: Cache Everything
   - Edge Cache TTL: 1 month

   *geminisoftware.mx/_astro/*
   - Cache Level: Cache Everything
   - Edge Cache TTL: 1 year

   *geminisoftware.mx/uploads/*
   - Cache Level: Cache Everything
   - Edge Cache TTL: 1 year
   ```

### 2. Cloudflare Settings

**Speed**:
- ✅ Auto Minify: JavaScript, CSS, HTML
- ✅ Brotli compression
- ✅ Rocket Loader: Off (we handle bundling)
- ✅ Early Hints
- ✅ HTTP/3 (with QUIC)

**Caching**:
- Browser Cache TTL: 4 hours
- Always Online: On
- Development Mode: Off (for production)

**Security**:
- SSL/TLS: Full (strict)
- Always Use HTTPS: On
- Automatic HTTPS Rewrites: On
- Minimum TLS Version: 1.2

---

## SEO Optimization

### 1. Verify Sitemap

```bash
# Check sitemap generation
curl https://geminisoftware.mx/sitemap-index.xml
```

### 2. Submit to Search Engines

**Google Search Console**:
1. Add property: https://geminisoftware.mx
2. Verify ownership (DNS or HTML file)
3. Submit sitemap: https://geminisoftware.mx/sitemap-index.xml
4. Request indexing for key pages

**Bing Webmaster Tools**:
1. Add site: https://geminisoftware.mx
2. Submit sitemap

### 3. Structured Data Testing

```bash
# Test structured data
curl https://geminisoftware.mx | grep -A 20 "application/ld+json"
```

Validate at:
- https://search.google.com/test/rich-results
- https://validator.schema.org/

### 4. robots.txt Verification

```bash
curl https://geminisoftware.mx/robots.txt
```

Should allow all except /admin

---

## Monitoring & Maintenance

### 1. Server Monitoring

```bash
# Install monitoring tools
sudo apt install -y htop iotop nethogs

# Check resource usage
htop          # CPU & Memory
iotop         # Disk I/O
nethogs       # Network usage
df -h         # Disk space
free -m       # Memory
```

### 2. Log Monitoring

```bash
# PM2 logs
pm2 logs --lines 100

# Nginx logs
sudo tail -f /var/log/nginx/geminisoftware_access.log
sudo tail -f /var/log/nginx/geminisoftware_error.log

# System logs
sudo journalctl -u nginx -f
```

### 3. Uptime Monitoring

**UptimeRobot** (Free):
1. Sign up: https://uptimerobot.com
2. Add Monitor: https://geminisoftware.mx
3. Alert contacts: Email/SMS
4. Check interval: 5 minutes

### 4. Performance Monitoring

**Lighthouse CI** (Automated):
```bash
npm install -g @lhci/cli

# Run Lighthouse audit
lhci autorun --collect.url=https://geminisoftware.mx
```

**Google Analytics**:
- Already configured in BaseLayout.astro
- Add GA_ID in `.env.production`

### 5. Backup Strategy

```bash
# Create backup script
cat > ~/backup.sh << 'EOF'
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/home/gemini/backups"
mkdir -p $BACKUP_DIR

# Backup database
cp ~/apps/gemini-software/gemini-backend/prisma/prod.db $BACKUP_DIR/db_$TIMESTAMP.db

# Backup uploads
tar -czf $BACKUP_DIR/uploads_$TIMESTAMP.tar.gz -C ~/apps/gemini-software/gemini-backend uploads/

# Keep only last 7 days
find $BACKUP_DIR -mtime +7 -delete

echo "Backup completed: $TIMESTAMP"
EOF

chmod +x ~/backup.sh

# Schedule daily backups
crontab -e
# Add: 0 2 * * * /home/gemini/backup.sh
```

---

## Performance Checklist

### ✅ Speed Optimization

- [x] **Gzip/Brotli compression** - Nginx configured
- [x] **Browser caching** - Cache-Control headers set
- [x] **CDN** - Cloudflare for static assets
- [x] **Image optimization** - WebP, responsive versions
- [x] **CSS code splitting** - Per-page CSS bundles
- [x] **JavaScript minification** - Terser with tree-shaking
- [x] **HTTP/2** - Enabled in Nginx
- [x] **Preconnect/DNS-prefetch** - Added to BaseLayout
- [x] **Critical CSS inline** - Above-fold styles inlined
- [x] **Lazy loading** - Images and components

### ✅ SEO Optimization

- [x] **SSL/HTTPS** - Let's Encrypt certificate
- [x] **Sitemap.xml** - Auto-generated by Astro
- [x] **robots.txt** - Configured properly
- [x] **Meta tags** - All pages have unique titles/descriptions
- [x] **Open Graph** - OG tags for social sharing
- [x] **Structured data** - JSON-LD for Organization
- [x] **Canonical URLs** - Set on all pages
- [x] **Mobile-friendly** - Responsive design
- [x] **Page speed** - Target: 90+ on Lighthouse
- [x] **Alt text** - Images have descriptive alt tags

### ✅ Security

- [x] **HTTPS only** - Forced redirect from HTTP
- [x] **Security headers** - HSTS, X-Frame-Options, etc.
- [x] **Rate limiting** - API and frontend protected
- [x] **CORS configured** - Only allowed origins
- [x] **SQL injection prevention** - Prisma ORM
- [x] **XSS prevention** - Input sanitization
- [x] **CSRF protection** - Token-based
- [x] **Environment variables** - Secrets not in code

---

## Quick Deployment Commands

### Update Application

```bash
cd ~/apps/gemini-software

# Pull latest code
git pull origin main

# Run deployment
./deploy.sh
```

### Rollback

```bash
# Stop current version
pm2 stop all

# Restore database backup
cp ~/backups/db_TIMESTAMP.db ~/apps/gemini-software/gemini-backend/prisma/prod.db

# Checkout previous version
git checkout <previous-commit-hash>

# Rebuild and restart
./deploy.sh
```

### Emergency Restart

```bash
pm2 restart all
sudo systemctl restart nginx
```

---

## Performance Targets

### Lighthouse Scores (Target: 90+)

- **Performance**: 92-95
- **Accessibility**: 95-100
- **Best Practices**: 95-100
- **SEO**: 95-100

### Web Vitals

- **LCP** (Largest Contentful Paint): <1.8s
- **FID** (First Input Delay): <100ms
- **CLS** (Cumulative Layout Shift): <0.1
- **FCP** (First Contentful Paint): <1.2s
- **TTI** (Time to Interactive): <3.0s

### Server Performance

- **Response Time**: <200ms (avg)
- **Uptime**: 99.9%+
- **Error Rate**: <0.1%

---

## Troubleshooting

### Backend not responding

```bash
pm2 logs gemini-backend --lines 50
pm2 restart gemini-backend
```

### Frontend not loading

```bash
pm2 logs gemini-frontend --lines 50
pm2 restart gemini-frontend
```

### Nginx errors

```bash
sudo nginx -t
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

### SSL certificate renewal fails

```bash
sudo certbot renew --dry-run
sudo systemctl stop nginx
sudo certbot renew
sudo systemctl start nginx
```

### Out of memory

```bash
# Check memory
free -h

# Restart services
pm2 restart all

# Consider upgrading server or optimizing
```

---

## Support & Resources

- **Astro Docs**: https://docs.astro.build
- **PM2 Docs**: https://pm2.keymetrics.io
- **Nginx Docs**: https://nginx.org/en/docs
- **Let's Encrypt**: https://letsencrypt.org
- **Cloudflare**: https://cloudflare.com

---

**🎉 Your application is now production-ready with maximum speed and SEO optimization!**
