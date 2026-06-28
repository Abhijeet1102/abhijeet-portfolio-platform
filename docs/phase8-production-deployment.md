# Phase 8: Production Readiness & Deployment Architecture

## Infrastructure Topology
- **Frontend**: Vercel (Configured via `NEXT_PUBLIC_SITE_URL`)
  - Next.js Edge Caching & ISR (Incremental Static Regeneration)
- **Backend API**: Railway / Render (Configured via `NEXT_PUBLIC_API_URL`)
  - Express.js running in a Docker container or Native Node environment.
- **Database**: MongoDB Atlas (Dedicated Cluster)
- **Object Storage**: Cloudinary (Media assets, Resumes, PDFs)
- **Vector Database**: Pinecone (For AI Assistant RAG)
- **Monitoring**: Sentry (Error tracking across Frontend & Backend)

## CI/CD Pipeline
- **GitHub Actions**: Configured in `.github/workflows/ci.yml`.
- Triggers on PRs to `main`.
- Steps: Install (pnpm) -> Lint -> Build -> Test (Placeholder).
- Vercel automatically deploys on successful merge to `main`.

## Security Hardening
- **Helmet**: Secures Express apps by setting various HTTP headers (XSS, Clickjacking, CSP).
- **CORS**: Restricted based on environment variables (e.g., `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_ADMIN_URL`).
- **Rate Limiting**: Applied strictly to `/api/v1/auth` endpoints to prevent brute-forcing.

## Performance Optimization (Lighthouse Target > 90)
- `next/image` utilized for all media.
- Framer Motion animations dynamically imported (`next/dynamic`) where heavy.
- MongoDB Queries heavily indexed (Slug, Email, Status, Date).

## DNS Strategy
1. Root Domain: Configuration driven based on DNS mapping.
2. `www` Subdomain -> CNAME to Vercel.
3. `api` Subdomain -> CNAME to Railway App URL.
4. `admin` Subdomain -> Managed via Next.js middleware routing internally within Vercel.

## Pre-Flight Checklist
- [ ] Connect MongoDB Atlas URI in Railway Production.
- [ ] Add Vercel Environment variables (NEXT_PUBLIC_API_URL).
- [ ] Generate strict JWT_SECRET for production.
- [ ] Validate robots.txt and sitemap generation.
