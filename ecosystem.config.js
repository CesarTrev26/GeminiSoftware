module.exports = {
  apps: [
    {
      // Backend API
      name: 'gemini-backend',
      script: './dist/server.js',
      cwd: './gemini-backend',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env_production: {
        NODE_ENV: 'production',
      },
    },
    {
      // Frontend (SSR)
      name: 'gemini-frontend',
      script: './dist/server/entry.mjs',
      cwd: './gemini-astro',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        HOST: '0.0.0.0',
        PORT: 4321,
      },
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
