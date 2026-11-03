# DNYL — Official Developer Portfolio & Digital Experience Engine

Official production codebase for **DNYL (Daniyal Hayat)** — Full-Stack Developer & Creative Builder specializing in React, TypeScript, native Kotlin Android applications, and Google Gemini AI platforms.

Live Website: [https://dnyl.vercel.app/](https://dnyl.vercel.app/)

---

## Architecture Overview

The DNYL portfolio engine is a production-grade full-stack Express + Vite application configured for seamless deployment on Vercel or Node.js runtime environments:

- **Frontend Core**: High-craft, responsive digital experience using semantic HTML5, modern CSS custom properties, GSAP 3 scroll animations, custom pointer controls, modal deep-dives, and interactive filters.
- **Backend API Gateway (`/api/contact.ts` & `server.ts`)**: Serverless-compatible Node.js/Express API handling direct contact form transmissions with the official Resend SDK.
- **Security Suite**: In-memory rate limiting (max 5 submissions / 10 min per IP), invisible honeypot anti-spam traps (`_hp_bot`), submission velocity limits, safe HTML sanitization, and strict input validation.
- **SEO & Discovery**: Automated `sitemap.xml`, `robots.txt`, `site.webmanifest`, `llms.txt`, `humans.txt`, OpenGraph cards, Twitter Cards, Schema.org JSON-LD structured data, and IndexNow discovery pinging.

---

## Directory Structure

```text
dnyl-portfolio/
│
├── api/
│   └── contact.ts              # Resend SDK direct email dispatch handler, rate limiter & templates
│
├── assets/                     # Core branding and graphic assets
│   ├── icons/                  # Favicon SVG, social icons, arrow marks
│   └── images/                 # Profile portrait, OpenGraph social card
│
├── css/
│   └── style.css               # Global design tokens, typography, layout, animations & themes
│
├── js/
│   ├── config.js               # Central communication constants & contact configuration
│   ├── github-sync.js          # Live GitHub API client & repository metrics calculator
│   ├── script.js               # Main portfolio interactive controller (GSAP, Modals, Forms, ⌘K)
│   └── vendor/                 # Local GSAP 3 core & ScrollTrigger engine
│
├── public/                     # Static production asset directory served at web root
│   ├── assets/                 # Synced icons & images
│   ├── css/                    # Synced stylesheets
│   ├── js/                     # Synced scripts
│   ├── 404.html                # Custom 404 error page
│   ├── privacy.html            # Privacy Policy
│   ├── terms.html              # Terms & Conditions
│   ├── robots.txt              # Search engine crawler directives
│   ├── sitemap.xml             # Auto-generated XML sitemap
│   └── site.webmanifest        # Progressive Web App manifest
│
├── scripts/
│   ├── generate-seo.mjs        # Automated sitemap generation & mirror sync tool
│   ├── repos_master.json       # Local fallback metadata for 12 featured projects
│   └── repos_snapshot.json     # Cached GitHub API metrics snapshot
│
├── src/
│   ├── config/
│   │   └── communication.ts    # TypeScript configuration exports
│   └── vite-env.d.ts           # Vite type declarations
│
├── .env.example                # Template for environment configuration
├── 404.html                    # Root 404 error template
├── index.html                  # Main portfolio single-page application entry
├── metadata.json               # Platform applet metadata
├── package.json                # Project dependencies and npm scripts
├── privacy.html                # Privacy Policy page
├── README.md                   # Technical documentation
├── server.ts                   # Express server entry point (Vite dev middleware + static dist serving)
├── terms.html                  # Terms & Conditions page
├── tsconfig.json               # TypeScript compiler configuration
└── vite.config.ts              # Vite bundler & dev server configuration
```

---

## Environment Variables

Copy `.env.example` to `.env` in local development:

```env
# Resend API Key starting with 're_' from https://resend.com
RESEND_API_KEY="re_your_resend_api_key_here"

# Destination Inbox
CONTACT_RECIPIENT_EMAIL="mdaniyalhayyat@gmail.com"

# Verified Sender Email (Default for testing: onboarding@resend.dev)
CONTACT_SENDER_EMAIL="DNYL Inquiries <onboarding@resend.dev>"

# WhatsApp Phone Number (International format without '+')
VITE_WHATSAPP_PHONE_NUMBER="923331001904"
```

---

## Local Development & Commands

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
Starts the Express server with embedded Vite middleware on `http://localhost:3000`:
```bash
npm run dev
```

### 3. Generate SEO Assets & Mirror Synchronization
Generates a fresh `sitemap.xml` with today's date and syncs static assets to `/public`:
```bash
npm run seo:generate
```

### 4. Run Type Checking
```bash
npm run lint
```

### 5. Build for Production
```bash
npm run build
```

---

## Deployment (Vercel & Node.js)

1. Connect the repository to **Vercel**.
2. Add environment variable `RESEND_API_KEY` in **Vercel Settings > Environment Variables**.
3. Set the build command to `npm run build` and output directory to `dist`.
4. Vercel automatically detects `/api/contact.ts` as a serverless function endpoint.

---

## License & Copyright

© 2026 Daniyal Hayat (DNYL). All rights reserved.
