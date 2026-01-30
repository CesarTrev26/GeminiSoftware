import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import compress from 'astro-compress';

// https://astro.build/config
export default defineConfig({
  site: 'https://geminisoftware.mx',
  output: 'static',
  adapter: vercel({
    runtime: 'nodejs20.x',
    webAnalytics: {
      enabled: true
    }
  }),
  integrations: [
    react(),
    tailwind(),
    sitemap({
      filter: (page) => !page.includes('/admin'),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      customPages: [
        'https://geminisoftware.mx/',
        'https://geminisoftware.mx/portfolio',
        'https://geminisoftware.mx/servicios',
        'https://geminisoftware.mx/contacto',
        'https://geminisoftware.mx/cotizar',
      ],
    }),
    compress({
      CSS: true,
      HTML: {
        removeAttributeQuotes: false,
        collapseWhitespace: true,
        conservativeCollapse: true,
        minifyCSS: true,
        minifyJS: true,
      },
      Image: false, // We'll handle images separately
      JavaScript: true,
      SVG: true,
    }),
  ],
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
    domains: [],
    remotePatterns: [],
  },
  vite: {
    ssr: {
      noExternal: ['gsap'],
    },
    build: {
      cssCodeSplit: true, // Enable CSS code splitting per page
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      cssMinify: true,
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            // Optimize asset naming for better caching
            if (assetInfo.name && assetInfo.name.endsWith('.css')) {
              return 'assets/[name].[hash].css';
            }
            return 'assets/[name].[hash][extname]';
          },
          manualChunks: (id) => {
            // Split vendor libraries into separate chunks
            if (id.includes('node_modules')) {
              // React and ALL its dependencies must be in the same chunk
              if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
                return 'vendor-react';
              }
              if (id.includes('gsap')) {
                return 'vendor-gsap';
              }
              if (id.includes('lenis')) {
                return 'vendor-lenis';
              }
              if (id.includes('framer-motion')) {
                return 'vendor-react'; // framer-motion depends on React
              }
              // Other vendor code
              return 'vendor';
            }
          },
        },
      },
    },
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  experimental: {
    clientPrerender: true,
  },
});
