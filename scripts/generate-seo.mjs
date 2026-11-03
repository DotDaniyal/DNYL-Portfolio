#!/usr/bin/env node
/**
 * DNYL — Automated SEO Sitemap, Robots & Static Mirror Synchronization Script
 * Ensures sitemap.xml, robots.txt, llms.txt, humans.txt, site.webmanifest, 404.html,
 * privacy.html, terms.html, and IndexNow verification files stay synchronized in /public.
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
  <url>
    <loc>${SITE_URL}/privacy.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${SITE_URL}/terms.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
`;

// Write updated sitemap.xml to root
fs.writeFileSync(path.join(rootDir, "sitemap.xml"), sitemapXml, "utf8");

// Sync static SEO and legal pages into /public
const seoFilesToSync = [
  "sitemap.xml",
  "robots.txt",
  "llms.txt",
  "humans.txt",
  "site.webmanifest",
  "dnyl-indexnow-key.txt",
  "404.html",
  "privacy.html",
  "terms.html"
];

const publicDir = path.join(rootDir, "public");

if (fs.existsSync(publicDir)) {
  for (const file of seoFilesToSync) {
    const src = path.join(rootDir, file);
    const dest = path.join(publicDir, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
    }
  }

  // Copy root JS, CSS, and Assets to public for static production serving
  const staticDirs = [
    { srcDir: path.join(rootDir, "css"), destDir: path.join(publicDir, "css") },
    { srcDir: path.join(rootDir, "js"), destDir: path.join(publicDir, "js") },
    { srcDir: path.join(rootDir, "assets"), destDir: path.join(publicDir, "assets") }
  ];

  for (const { srcDir, destDir } of staticDirs) {
    if (fs.existsSync(srcDir)) {
      fs.cpSync(srcDir, destDir, { recursive: true });
    }
  }
}

console.log(`[DNYL SEO] Generated sitemap.xml (lastmod: ${today}) and synced public asset tree.`);

// Optional IndexNow ping when run explicitly with --ping-indexnow
if (process.argv.includes("--ping-indexnow")) {
  const payload = {
    host: "dnyl.vercel.app",
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/dnyl-indexnow-key.txt`,
    urlList: [`${SITE_URL}/`, `${SITE_URL}/privacy.html`, `${SITE_URL}/terms.html`]
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
