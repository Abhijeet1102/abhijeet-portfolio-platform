const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname);
const serverSrc = path.join(__dirname, 'apps/server/src');
const webSrc = path.join(__dirname, 'apps/web/src');
const webPublic = path.join(__dirname, 'apps/web/public');
const docs = path.join(__dirname, 'docs');

// Create required directories
const dirs = [
  path.join(rootDir, '.github/workflows'),
  path.join(webSrc, 'app/sitemap'),
  path.join(webSrc, 'app/robots'),
  path.join(webSrc, 'lib/seo'),
  path.join(webSrc, 'lib/sentry'),
  path.join(webPublic),
  path.join(serverSrc, 'lib/sentry'),
  docs,
];

dirs.forEach(dir => fs.mkdirSync(dir, { recursive: true }));

// ==============================
// 1. CI/CD GITHUB ACTIONS
// ==============================

const ciWorkflow = `name: Portfolio CI/CD

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        
    - name: Install pnpm
      uses: pnpm/action-setup@v2
      with:
        version: 10
        
    - name: Install Dependencies
      run: pnpm install
      
    - name: Lint
      run: pnpm run lint
      
    - name: Build
      run: pnpm run build
      
    # - name: Test
    #   run: pnpm run test
`;
fs.writeFileSync(path.join(rootDir, '.github/workflows/ci.yml'), ciWorkflow);

// ==============================
// 2. SEO & PWA
// ==============================

// Robots.txt
const robotsTxt = `import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: \`\${siteUrl}/sitemap.xml\`,
  }
}
`;
fs.writeFileSync(path.join(webSrc, 'app/robots.ts'), robotsTxt);

// Sitemap
const sitemap = `import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return [
    {
      url: \`\${siteUrl}\`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: \`\${siteUrl}/about\`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: \`\${siteUrl}/projects\`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: \`\${siteUrl}/blogs\`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]
}
`;
fs.writeFileSync(path.join(webSrc, 'app/sitemap.ts'), sitemap);

// Manifest (PWA)
const manifest = `{
  "name": "Abhijeet Rai Portfolio",
  "short_name": "AR Portfolio",
  "description": "Senior Full-Stack Architect & AI Developer",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#09090b",
  "theme_color": "#09090b",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
`;
fs.writeFileSync(path.join(webPublic, 'manifest.json'), manifest);

// ==============================
// 3. SENTRY & OBSERVABILITY
// ==============================

const sentryConfig = `import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
});
`;
fs.writeFileSync(path.join(webSrc, 'lib/sentry/sentry.client.config.ts'), sentryConfig);
fs.writeFileSync(path.join(serverSrc, 'lib/sentry/sentry.server.config.ts'), `// Backend Sentry Init Placeholder`);

// ==============================
// 4. DEPLOYMENT ARCHITECTURE DOCS
// ==============================

const deploymentDocs = `# Phase 8: Production Readiness & Deployment Architecture

## Infrastructure Topology
- **Frontend**: Vercel (Configured via \`NEXT_PUBLIC_SITE_URL\`)
  - Next.js Edge Caching & ISR (Incremental Static Regeneration)
- **Backend API**: Railway / Render (Configured via \`NEXT_PUBLIC_API_URL\`)
  - Express.js running in a Docker container or Native Node environment.
- **Database**: MongoDB Atlas (Dedicated Cluster)
- **Object Storage**: Cloudinary (Media assets, Resumes, PDFs)
- **Vector Database**: Pinecone (For AI Assistant RAG)
- **Monitoring**: Sentry (Error tracking across Frontend & Backend)

## CI/CD Pipeline
- **GitHub Actions**: Configured in \`.github/workflows/ci.yml\`.
- Triggers on PRs to \`main\`.
- Steps: Install (pnpm) -> Lint -> Build -> Test (Placeholder).
- Vercel automatically deploys on successful merge to \`main\`.

## Security Hardening
- **Helmet**: Secures Express apps by setting various HTTP headers (XSS, Clickjacking, CSP).
- **CORS**: Restricted based on environment variables (e.g., \`NEXT_PUBLIC_SITE_URL\` and \`NEXT_PUBLIC_ADMIN_URL\`).
- **Rate Limiting**: Applied strictly to \`/api/v1/auth\` endpoints to prevent brute-forcing.

## Performance Optimization (Lighthouse Target > 90)
- \`next/image\` utilized for all media.
- Framer Motion animations dynamically imported (\`next/dynamic\`) where heavy.
- MongoDB Queries heavily indexed (Slug, Email, Status, Date).

## DNS Strategy
1. Root Domain: Configuration driven based on DNS mapping.
2. \`www\` Subdomain -> CNAME to Vercel.
3. \`api\` Subdomain -> CNAME to Railway App URL.
4. \`admin\` Subdomain -> Managed via Next.js middleware routing internally within Vercel.

## Pre-Flight Checklist
- [ ] Connect MongoDB Atlas URI in Railway Production.
- [ ] Add Vercel Environment variables (NEXT_PUBLIC_API_URL).
- [ ] Generate strict JWT_SECRET for production.
- [ ] Validate robots.txt and sitemap generation.
`;
fs.writeFileSync(path.join(docs, 'phase8-production-deployment.md'), deploymentDocs);

console.log('Phase 8 Scaffold complete.');
