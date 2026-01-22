# 🚀 Quick Start Guide - Gemini Software
## Get Your Site Live in 30 Minutes

---

## Prerequisites
- Node.js 18+ installed
- GitHub account (optional, for deployment)
- Domain name (geminisoftware.mx)
- Email account for contact forms

---

## Step 1: Configure Environment Variables (5 min)

### Frontend (.env.production)
```bash
cd gemini-astro
cp .env.production.example .env.production
```

Edit `.env.production`:
```env
PUBLIC_API_URL=https://your-backend-url.com/api
PUBLIC_GA_ID=G-XXXXXXXXXX  # Get from Google Analytics
PUBLIC_SITE_URL=https://geminisoftware.mx
PUBLIC_CONTACT_EMAIL=contacto@geminisoftware.mx
PUBLIC_WHATSAPP=+528136600062
```

### Backend (.env)
```bash
cd gemini-backend
```

Edit `.env`:
```env
# Database (Use PostgreSQL for production)
DATABASE_URL=postgresql://user:password@host:5432/database

# JWT Secret (generate random string)
JWT_SECRET=your-very-secure-random-string-here

# Email (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Frontend URL
FRONTEND_URL=https://geminisoftware.mx

# Server
PORT=3001
```

---

## Step 2: Build & Test Locally (5 min)

### Backend
```bash
cd gemini-backend
npm install
npm run build
npm start
```

Test: http://localhost:3001/api/services (should return JSON)

### Frontend
```bash
cd gemini-astro
npm install
npm run build
npm run preview
```

Test: http://localhost:4321 (should load homepage)

---

## Step 3: Deploy Backend (10 min)

### Option A: Railway.app (Easiest)
1. Go to https://railway.app and sign up
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Add environment variables (from Step 1)
5. Deploy! Railway will give you a URL like `https://your-app.railway.app`

### Option B: Render.com
1. Go to https://render.com and sign up
2. Click "New +" → "Web Service"
3. Connect repository
4. Build command: `npm install && npm run build && npx prisma generate`
5. Start command: `npm start`
6. Add environment variables
7. Deploy!

---

## Step 4: Deploy Frontend (5 min)

### Option A: Vercel (Recommended)
```bash
npm i -g vercel
cd gemini-astro
vercel login
vercel --prod
```

Add environment variables in Vercel dashboard:
- `PUBLIC_API_URL` (from Step 3 backend URL)
- `PUBLIC_GA_ID`
- Other PUBLIC_* vars

### Option B: Netlify
```bash
npm i -g netlify-cli
cd gemini-astro
netlify login
netlify deploy --prod
```

---

## Step 5: Configure DNS (5 min)

In your domain registrar (GoDaddy, Namecheap, etc.):

### For Vercel:
1. Add CNAME record: `www` → `cname.vercel-dns.com`
2. Add A record: `@` → Vercel's IP (they'll provide)

### For Netlify:
1. Add CNAME record: `www` → `your-site.netlify.app`
2. Add A record: `@` → Netlify's IP

### For Backend API:
1. Add CNAME record: `api` → your backend URL
   OR add subdomain in Railway/Render dashboard

---

## Step 6: Post-Deployment Checks (5 min)

✅ **Test These URLs:**
- https://geminisoftware.mx (homepage loads)
- https://geminisoftware.mx/servicios (services page)
- https://geminisoftware.mx/portfolio (portfolio page)
- https://your-backend/api/services (returns JSON)

✅ **Test Contact Form:**
1. Go to https://geminisoftware.mx/#contacto
2. Fill out form and submit
3. Check email inbox (should receive notification)

✅ **Test Admin Panel:**
1. Go to https://geminisoftware.mx/admin
2. Login (default: admin@geminisoftware.mx / admin123)
3. **IMMEDIATELY change password!**

---

## Step 7: Setup Google Analytics (5 min)

1. Go to https://analytics.google.com
2. Create account → Create property
3. Property name: "Gemini Software"
4. Choose website tracking
5. Copy Measurement ID (G-XXXXXXXXXX)
6. Add to Vercel environment variables:
   - Key: `PUBLIC_GA_ID`
   - Value: `G-XXXXXXXXXX`
7. Redeploy site on Vercel

Verify tracking:
- Visit your site
- Open Google Analytics → Real-time
- Should see 1 active user (you!)

---

## Step 8: Google Search Console (5 min)

1. Go to https://search.google.com/search-console
2. Add property: https://geminisoftware.mx
3. Verify ownership (upload HTML file or DNS record)
4. Submit sitemap: https://geminisoftware.mx/sitemap-index.xml
5. Wait 24-48 hours for indexing

---

## Step 9: Social Media Setup (Optional, 15 min)

### Google My Business
1. https://business.google.com
2. Add business: "Gemini Software"
3. Location: Monterrey, Nuevo León
4. Category: Software Company
5. Add website, phone, hours
6. Upload photos
7. Verify (postcard or phone)

### Facebook Page
1. Create business page
2. Add logo, cover photo
3. About section with services
4. Call-to-action: "Contact Us"
5. Link to website

### Instagram Business
1. Convert to business account
2. Add contact button
3. Link in bio: website URL
4. Post first content: portfolio highlights

---

## Troubleshooting

### Contact form not working:
```bash
# Check backend logs
railway logs  # if using Railway
# OR
render logs   # if using Render

# Verify SMTP settings in .env
# Try sending test email manually
```

### Site not loading:
- Check DNS propagation: https://dnschecker.org
- May take up to 24 hours for DNS to propagate
- Try clearing browser cache

### Images not showing:
- Check `PUBLIC_API_URL` includes `/api`
- Verify backend uploads folder is accessible
- Check CORS configuration in backend

### Google Analytics not tracking:
- Wait 24-48 hours for data to appear
- Check Real-time reports (should be instant)
- Verify `PUBLIC_GA_ID` is correct
- Clear cache and revisit site

---

## Security Checklist

✅ **Immediately After Deployment:**
- [ ] Change admin password (from admin123)
- [ ] Update JWT_SECRET to random string
- [ ] Verify HTTPS is working (https://)
- [ ] Test rate limiting (try 10+ rapid requests)
- [ ] Check robots.txt is accessible
- [ ] Verify .env files are NOT committed to git

---

## Success! 🎉

Your site is now live! Here's what to do next:

### Week 1:
- Post on social media announcing launch
- Email existing contacts with website link
- Add website to email signature
- Test everything thoroughly

### Week 2:
- Submit to directories (Yelp, Yellow Pages)
- Start Google Ads campaign ($10/day)
- Post 3x per week on Instagram
- Request reviews from clients

### Month 1:
- Analyze Google Analytics data
- Write first blog post for SEO
- A/B test different CTAs
- Add testimonials from clients

---

## Support Resources

- **Astro Docs**: https://docs.astro.build
- **Deployment Issues**: Check logs in Railway/Render/Vercel dashboard
- **SEO Help**: Google Search Console Help Center
- **Analytics**: Google Analytics Academy (free courses)

---

## Quick Commands Reference

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Backend
npm start            # Start production server
npm run db:push      # Update database
npm run db:studio    # Open Prisma Studio

# Deployment
vercel --prod        # Deploy to Vercel
netlify deploy --prod # Deploy to Netlify
git push origin main # Trigger auto-deploy (if configured)
```

---

**Congratulations on launching your website!** 🚀

Track your first lead coming in, and celebrate each milestone!

*Questions? Check DEPLOYMENT_CHECKLIST.md and SEO_OPTIMIZATION_REPORT.md for detailed info.*
