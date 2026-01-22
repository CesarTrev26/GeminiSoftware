# 🚀 Gemini Software - Modern Web Platform

Modern SPA website for Gemini Software, built with **Astro + React** (frontend) and **Node.js + Express + Prisma** (backend).

## ✨ Features

### Frontend (Astro)
- ⚡ Blazing fast static site generation
- 🎨 Modern design with Tailwind CSS
- 🖼️ GSAP animations + Lenis smooth scroll
- 📱 Fully responsive (mobile-first)
- 🔍 SEO optimized with structured data
- 🌐 View Transitions API for smooth page transitions

### Backend (Node.js)
- 🗄️ Prisma ORM with SQLite (dev) / PostgreSQL (prod)
- 🔐 JWT Authentication
- 📧 Email notifications with Nodemailer
- 📊 RESTful API for portfolio CRUD
- 🛡️ Security middleware (Helmet, CORS, Rate Limiting)

## 🏗️ Project Structure

```
GeminiSoftware/
├── gemini-astro/           # Frontend (Astro + React)
│   ├── src/
│   │   ├── components/     # Astro components
│   │   ├── layouts/        # Page layouts
│   │   ├── pages/          # Site pages
│   │   ├── lib/            # Utilities & API client
│   │   └── styles/         # Global CSS
│   └── public/             # Static assets
│
├── gemini-backend/         # Backend (Node.js + Express)
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   └── config/         # Configuration
│   └── prisma/             # Database schema & seeds
│
└── .vscode/                # VS Code tasks
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

1. **Install Frontend Dependencies**
   ```bash
   cd gemini-astro
   npm install
   ```

2. **Install Backend Dependencies**
   ```bash
   cd gemini-backend
   npm install
   ```

3. **Setup Database**
   ```bash
   cd gemini-backend
   cp .env.example .env    # Configure environment variables
   npx prisma generate     # Generate Prisma client
   npx prisma db push      # Create database tables
   npx tsx prisma/seed.ts  # Seed initial data
   ```

### Running the Project

**Option 1: VS Code Tasks (Recommended)**

Press `Ctrl+Shift+P` → "Tasks: Run Task" → "Start Both Servers"

**Option 2: Manual**

Terminal 1 (Backend):
```bash
cd gemini-backend
node dist/server.js
```

Terminal 2 (Frontend):
```bash
cd gemini-astro
npm run dev
```

### URLs
- Frontend: http://localhost:4321
- Backend API: http://localhost:3001

## 📡 API Endpoints

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get all projects |
| GET | `/api/projects/:slug` | Get single project |
| GET | `/api/projects/categories` | Get all categories |
| POST | `/api/projects` | Create project (auth) |
| PUT | `/api/projects/:id` | Update project (auth) |
| DELETE | `/api/projects/:id` | Delete project (auth) |

### Contact
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contacts` | Submit contact form |
| GET | `/api/contacts` | Get all contacts (auth) |

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user (auth) |

## 🎨 Design System

### Colors
- **Cyan**: `#00D3FF` - Primary accent
- **Blue**: `#003799` - Secondary
- **Dark Blue**: `#01183D` - Background/Text

### Fonts
- **Montserrat** - Headings
- **Montserrat Alt** - Display text

## 🔐 Admin Access

Default admin credentials (change in production!):
- Email: `admin@geminisoftware.mx`
- Password: `GeminiAdmin2024!`

## 📦 Building for Production

### Frontend
```bash
cd gemini-astro
npm run build
```

### Backend
```bash
cd gemini-backend
npx tsc
```

## 🌐 Deployment

### Frontend (Vercel/Netlify)
1. Connect your repo
2. Set build command: `npm run build`
3. Set output directory: `dist`

### Backend (Railway/Render)
1. Set environment variables from `.env`
2. Update `DATABASE_URL` for PostgreSQL
3. Run `npx prisma migrate deploy`

## 📝 Environment Variables

### Frontend (.env)
```env
PUBLIC_API_URL=http://localhost:3001/api
```

### Backend (.env)
```env
NODE_ENV=development
PORT=3001
DATABASE_URL="file:./dev.db"
JWT_SECRET=your-secret-key
ADMIN_EMAIL=admin@geminisoftware.mx
ADMIN_PASSWORD=GeminiAdmin2024!
CORS_ORIGIN=http://localhost:4321
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - Gemini Software © 2024
