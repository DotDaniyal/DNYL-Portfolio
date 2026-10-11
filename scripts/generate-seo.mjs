#!/usr/bin/env node
/**
 * DNYL — Automated SEO Sitemap, Robots & Static Mirror Synchronization Script
 * Ensures sitemap.xml, robots.txt, llms.txt, humans.txt, site.webmanifest, 404.html,
 * and IndexNow verification files stay synchronized across root, /public, and /portfolio.
 *
 * Optional IndexNow submission:
 *   node scripts/generate-seo.mjs --ping-indexnow
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const SITE_URL = "https://dnyl.vercel.app";
const INDEXNOW_KEY = "dnyl2026officialportfolioindexnowkey";
const today = new Date().toISOString().split("T")[0];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/" />
    <image:image>
      <image:loc>${SITE_URL}/assets/images/profile.jpg</image:loc>
      <image:title>DNYL — Daniyal Hayat Official Portfolio Portrait</image:title>
      <image:caption>Daniyal Hayat (DNYL), Full-Stack Developer &amp; Creative Builder specializing in React, TypeScript, Kotlin Android, and Google Gemini AI.</image:caption>
    </image:image>
    <image:image>
      <image:loc>${SITE_URL}/assets/images/dnyl-og-card.svg</image:loc>
      <image:title>DNYL | Official Portfolio, Projects &amp; Digital Experience</image:title>
      <image:caption>Official brand card for DNYL (${SITE_URL}/) by Daniyal Hayat.</image:caption>
    </image:image>
  </url>
</urlset>
`;

// Write updated sitemap.xml to root
fs.writeFileSync(path.join(rootDir, "sitemap.xml"), sitemapXml, "utf8");

// Sync static SEO and asset files into /public and /portfolio if present
const seoFilesToSync = [
  "sitemap.xml",
  "robots.txt",
  "llms.txt",
  "humans.txt",
  "site.webmanifest",
  "dnyl-indexnow-key.txt",
  "404.html"
];

const targetDirs = [
  path.join(rootDir, "public"),
  path.join(rootDir, "portfolio")
];

for (const dir of targetDirs) {
  if (fs.existsSync(dir)) {
    for (const file of seoFilesToSync) {
      const src = path.join(rootDir, file);
      const dest = path.join(dir, file);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
      }
    }
    // Sync OG card SVG
    const ogSrc = path.join(rootDir, "assets", "images", "dnyl-og-card.svg");
    const ogDestDir = path.join(dir, "assets", "images");
    if (fs.existsSync(ogSrc) && fs.existsSync(ogDestDir)) {
      fs.copyFileSync(ogSrc, path.join(ogDestDir, "dnyl-og-card.svg"));
    }
  }
}

console.log(`[DNYL SEO] Generated sitemap.xml (lastmod: ${today}) and synced SEO discovery files.`);

// Optional IndexNow ping when run explicitly with --ping-indexnow
if (process.argv.includes("--ping-indexnow")) {
  const payload = {
    host: "dnyl.vercel.app",
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/dnyl-indexnow-key.txt`,
    urlList: [`${SITE_URL}/`]
  };

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload)
    });
    console.log(`[DNYL IndexNow] Status: ${res.status} ${res.statusText}`);
  } catch (err) {
    console.warn(`[DNYL IndexNow] Could not reach api.indexnow.org:`, err.message);
  }
}
