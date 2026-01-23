import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';
import compress from 'astro-compress';

// https://astro.build/config
export default defineConfig({
  site: 'https://geminisoftware.mx',
  output: 'hybrid',
  adapter: vercel(),
  integrations: [
    react(),
    tailwind(),
    // sitemap({
    //   filter: (page) => !page.includes('/admin'),
    // }),
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
      cssMinify: true, // Keep default CSS minification
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Split vendor libraries into separate chunks
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'vendor-react';
              }
              if (id.includes('gsap')) {
                return 'vendor-gsap';
              }
              if (id.includes('lenis')) {
                return 'vendor-lenis';
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
