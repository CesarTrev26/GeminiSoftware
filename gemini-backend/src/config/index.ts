import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || [
      'http://localhost:4321',
      'http://localhost:4322',
      'http://localhost:4323',
      'http://localhost:3000'
    ],
    credentials: true,
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  
  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.EMAIL_FROM || 'noreply@geminisoftware.mx',
  },
  
  upload: {
    dir: process.env.UPLOAD_DIR || './uploads',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10),
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  },
  
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@geminisoftware.mx',
    password: process.env.ADMIN_PASSWORD || 'admin123456',
  },

  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
  },
};

export default config;
