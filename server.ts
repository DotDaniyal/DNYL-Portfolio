import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { processContactSubmission } from './api/contact.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = parseInt(process.env.PORT || '3000', 10);

async function createServer() {
  const app = express();

  // Parse JSON and URL-encoded request bodies
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // API Route: Health Check & System Status
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'healthy',
      app: 'DNYL Portfolio Engine',
      recipient: process.env.CONTACT_RECIPIENT_EMAIL || 'mdaniyalhayyat@gmail.com',
      whatsapp: process.env.VITE_WHATSAPP_PHONE_NUMBER || '923331001904',
      emailServiceActive: Boolean(process.env.RESEND_API_KEY)
    });
  });

  // API Route: Contact Form Transmission (Direct Email Sending Gateway)
  app.post('/api/contact', async (req, res) => {
    try {
      const clientIp = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown')
        .toString()
        .split(',')[0]
        .trim();

      const result = await processContactSubmission(req.body, clientIp);
      res.status(result.status).json(result.body);
    } catch (err: any) {
      console.error('[SERVER ERROR] /api/contact unhandled exception:', err);
      res.status(500).json({
        success: false,
        error: 'An unexpected server error occurred while processing your message.'
      });
    }
  });

  app.get('/api/contact', (_req, res) => {
    res.json({
      status: 'online',
      gateway: 'DNYL Direct Email & Messaging Gateway',
      recipient: process.env.CONTACT_RECIPIENT_EMAIL || 'mdaniyalhayyat@gmail.com',
      whatsapp: process.env.VITE_WHATSAPP_PHONE_NUMBER || '923331001904',
      emailServiceConfigured: Boolean(process.env.RESEND_API_KEY)
    });
  });

  // Development vs Production Serving
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        port: PORT,
        host: '0.0.0.0',
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {}
      },
      appType: 'spa'
    });

    app.use(vite.middlewares);
  } else {
    // Production: serve built static assets from dist
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[DNYL SERVER] Ready and listening on http://0.0.0.0:${PORT} (${isProduction ? 'production' : 'development'})`);
  });
}

createServer().catch((err) => {
  console.error('[DNYL SERVER FATAL] Failed to start server:', err);
  process.exit(1);
});
