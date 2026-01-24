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

// Trust proxy - Required for Fly.io and other reverse proxies
app.set('trust proxy', 1);

// CORS - Must be before other middleware
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = Array.isArray(config.cors.origin) 
      ? config.cors.origin 
      : [config.cors.origin];
    
    console.log(`[CORS] Request from origin: ${origin || 'NO ORIGIN (SSR)'}`);
    console.log(`[CORS] Allowed origins:`, allowedOrigins);
    
    // Allow requests with no origin (like mobile apps, Postman, or SSR)
    if (!origin) {
      console.log(`[CORS] ✓ Allowed (no origin)`);
      callback(null, true);
      return;
    }
    
    // Check exact match in allowed origins
    if (allowedOrigins.includes(origin)) {
      console.log(`[CORS] ✓ Allowed (exact match)`);
      callback(null, true);
      return;
    }
    
    // Allow Vercel preview URLs (*.vercel.app)
    if (origin.includes('.vercel.app')) {
      console.log(`[CORS] ✓ Allowed (Vercel preview)`);
      callback(null, true);
      return;
    }
    
    console.log(`[CORS] ✗ Blocked`);
    callback(new Error('Not allowed by CORS'));
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
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
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
      // Determine server URL based on environment
      const getServerUrl = () => {
        if (process.env.FLY_APP_NAME) {
          return `https://${process.env.FLY_APP_NAME}.fly.dev`;
        }
        if (config.nodeEnv === 'production' && process.env.RENDER_EXTERNAL_URL) {
          return process.env.RENDER_EXTERNAL_URL;
        }
        return `http://localhost:${config.port}`;
      };

      const serverUrl = getServerUrl();

      console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   Gemini Software API!!                                   ║
║                                                           ║
║   Server running on ↓                                     ║
║   ${serverUrl.padEnd(30)}                                 ║
║   Environment ↓                                           ║
║   ${config.nodeEnv.padEnd(39)}                            ║
║                                                           ║
║   Endpoints:                                              ║
║   • GET  /               - API info                       ║
║   • GET  /api/health     - Health check                   ║
║   • GET  /api/projects      - List all projects           ║
║   • GET  /api/projects/:id  - Get single project          ║
║   • POST /api/projects      - Create project (admin)      ║
║   • PUT  /api/projects/:id  - Update project (admin)      ║
║   • DEL  /api/projects/:id  - Delete project (admin)      ║
║   • POST /api/contacts      - Submit contact form         ║
║   • GET  /api/contacts      - List contacts (admin)       ║
║   • POST /api/auth/login    - Login                       ║
║   • POST /api/auth/register - Register (admin)            ║
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
