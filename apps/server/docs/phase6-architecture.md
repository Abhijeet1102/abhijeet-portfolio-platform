# Phase 6: CMS Portfolio & Analytics Architecture

## Global Search & Filter Engine Contracts
Shared generic interface for searching `Projects`, `Blogs`, and `Certificates`.
- **Query Params**: `?q=keyword&category=web&tags=react,node&sort=-createdAt&page=1&limit=10`
- **Database Abstraction**: The `BaseRepository.findAll` will dynamically parse `tags` ($in) and `q` ($text or $regex) into MongoDB filters.

## Data Fetching Strategy (Next.js Server Components)
- Public routes (`/projects`, `/blogs`) will use standard `fetch` with Next.js revalidation (ISR) to cache responses and maintain SEO optimization.
- Missing pages or errors will default to React Suspense boundaries (`loading.tsx`) and error boundaries (`error.tsx`).
- Empty states handled conditionally on the server before emitting the UI.

## Home Page Composition
1. **Hero**: Fetches data from `Profile` (headline, bio, availabilityStatus).
2. **Featured Projects**: `/api/v1/projects?featured=true&limit=3`
3. **Quick Stats**: Summarized metrics from `Repository` and `Analytics`.
4. **Skills/Experience Preview**: Summarized limit queries.

## API Contracts (Phase 6 Modules)
- `GET /api/v1/profile` -> Fetches personal profile singleton
- `PATCH /api/v1/profile` -> Updates profile (Admin)
- `GET /api/v1/blogs` -> Fetches paginated blogs with search/filter engine
- `POST /api/v1/messages` -> Contact form submit with Email triggering queue
- `POST /api/v1/analytics/track` -> Fire and forget event tracking schema
