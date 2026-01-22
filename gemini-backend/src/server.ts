import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { config } from './config';
import routes from './routes';
import { seedAdminUser } from './controllers/authController';

const app = express();

// CORS - Must be before other middleware
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = Array.isArray(config.cors.origin) 
      ? config.cors.origin 
      : [config.cors.origin];
    
    console.log(`[CORS] Request from origin: ${origin || 'NO ORIGIN (SSR)'}`);
    console.log(`[CORS] Allowed origins:`, allowedOrigins);
    
    // Allow requests with no origin (like mobile apps, Postman, or SSR)
    if (!origin || allowedOrigins.includes(origin)) {
      console.log(`[CORS] ✓ Allowed`);
      callback(null, true);
    } else {
      console.log(`[CORS] ✗ Blocked`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Static files for uploads - Before helmet to avoid CORS issues
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
  setHeaders: (res) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
}));

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Compression
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 requests per windowMs
  message: {
    success: false,
    message: 'Demasiadas solicitudes, por favor intenta de nuevo más tarde.',
  },
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API routes
app.use('/api', routes);

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'Gemini Software API',
    version: '1.0.0',
    docs: '/api/health',
    endpoints: {
      projects: '/api/projects',
      contacts: '/api/contacts',
      auth: '/api/auth',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
});

// Start server
const start = async () => {
  try {
    // Seed admin user
    await seedAdminUser();
    
    app.listen(config.port, () => {
      console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 Gemini Software API                                  ║
║                                                           ║
║   Server running on: http://localhost:${config.port}              ║
║   Environment: ${config.nodeEnv}                               ║
║                                                           ║
║   Endpoints:                                              ║
║   • GET  /api/projects      - List all projects           ║
║   • GET  /api/projects/:id  - Get single project          ║
║   • POST /api/projects      - Create project (admin)      ║
║   • PUT  /api/projects/:id  - Update project (admin)      ║
║   • DEL  /api/projects/:id  - Delete project (admin)      ║
║   • POST /api/contacts      - Submit contact form         ║
║   • POST /api/auth/login    - Login                       ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
