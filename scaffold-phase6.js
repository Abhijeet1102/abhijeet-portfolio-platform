const fs = require('fs');
const path = require('path');

const serverSrc = path.join(__dirname, 'apps/server/src');
const webSrc = path.join(__dirname, 'apps/web/src');
const serverDocs = path.join(__dirname, 'apps/server/docs');

// Create required directories
const dirs = [
  path.join(serverSrc, 'models'),
  path.join(webSrc, 'lib/store'),
  path.join(webSrc, 'app/admin/skills'),
  path.join(webSrc, 'app/admin/experiences'),
  path.join(webSrc, 'app/admin/blogs'),
  path.join(webSrc, 'app/admin/certificates'),
  path.join(webSrc, 'app/admin/gallery'),
  path.join(webSrc, 'app/admin/testimonials'),
  path.join(webSrc, 'app/admin/messages'),
  path.join(webSrc, 'app/admin/analytics'),
  path.join(webSrc, 'app/admin/settings'),
  path.join(webSrc, 'app/admin/profile'),
  path.join(webSrc, 'app/blogs/[slug]'),
];

dirs.forEach(dir => fs.mkdirSync(dir, { recursive: true }));

// ==============================
// 1. BACKEND SCHEMAS (SERVER)
// ==============================

// Profile Schema
const profileModel = `import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
  name: string;
  title: string;
  headline: string;
  bio: string;
  location: string;
  email: string;
  phone?: string;
  profileImage?: string;
  resumeUrl?: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  education: any[];
  experienceSummary?: string;
  achievements: string[];
  availabilityStatus: 'AVAILABLE' | 'OPEN_TO_OFFERS' | 'NOT_AVAILABLE';
  techStack: string[];
  interests: string[];
}

const ProfileSchema = new Schema<IProfile>({
  name: { type: String, required: true },
  title: { type: String, required: true },
  headline: { type: String, required: true },
  bio: { type: String, required: true },
  location: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  profileImage: { type: String },
  resumeUrl: { type: String },
  socialLinks: { type: Schema.Types.Mixed, default: {} },
  education: [{ type: Schema.Types.Mixed }],
  experienceSummary: { type: String },
  achievements: [{ type: String }],
  availabilityStatus: { type: String, enum: ['AVAILABLE', 'OPEN_TO_OFFERS', 'NOT_AVAILABLE'], default: 'AVAILABLE' },
  techStack: [{ type: String }],
  interests: [{ type: String }],
}, { timestamps: true });

export const Profile = mongoose.model<IProfile>('Profile', ProfileSchema);
`;
fs.writeFileSync(path.join(serverSrc, 'models/Profile.ts'), profileModel);

// Blog Schema
const blogModel = `import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string; // Markdown support
  excerpt: string;
  coverImage?: string;
  categories: string[];
  tags: string[];
  readingTime: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  featured: boolean;
  seoMetadata: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  author: mongoose.Types.ObjectId;
  publishedAt?: Date;
  isDeleted: boolean;
}

const BlogSchema = new Schema<IBlog>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true },
  coverImage: { type: String },
  categories: [{ type: String }],
  tags: [{ type: String, index: true }],
  readingTime: { type: Number, default: 0 },
  status: { type: String, enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'], default: 'DRAFT', index: true },
  featured: { type: Boolean, default: false },
  seoMetadata: { type: Schema.Types.Mixed, default: {} },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  publishedAt: { type: Date },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

export const Blog = mongoose.model<IBlog>('Blog', BlogSchema);
`;
fs.writeFileSync(path.join(serverSrc, 'models/Blog.ts'), blogModel);

// Message Schema
const messageModel = `import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED';
  repliedAt?: Date;
  replyContent?: string;
}

const MessageSchema = new Schema<IMessage>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String },
  message: { type: String, required: true },
  status: { type: String, enum: ['NEW', 'READ', 'REPLIED', 'ARCHIVED'], default: 'NEW', index: true },
  repliedAt: { type: Date },
  replyContent: { type: String },
}, { timestamps: true });

export const Message = mongoose.model<IMessage>('Message', MessageSchema);
`;
fs.writeFileSync(path.join(serverSrc, 'models/Message.ts'), messageModel);

// Analytics Schema
const analyticsModel = `import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalytics extends Document {
  eventType: 'PAGE_VIEW' | 'PROJECT_VIEW' | 'BLOG_VIEW' | 'RESUME_DOWNLOAD';
  resourceId?: string; // slug or ID
  visitorId: string; // Hash or session token
  deviceInfo: {
    browser?: string;
    os?: string;
    deviceType?: 'DESKTOP' | 'MOBILE' | 'TABLET';
  };
  referrer?: string;
  country?: string;
}

const AnalyticsSchema = new Schema<IAnalytics>({
  eventType: { type: String, required: true, index: true },
  resourceId: { type: String, index: true },
  visitorId: { type: String, required: true, index: true },
  deviceInfo: { type: Schema.Types.Mixed, default: {} },
  referrer: { type: String },
  country: { type: String },
}, { timestamps: true });

export const Analytics = mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);
`;
fs.writeFileSync(path.join(serverSrc, 'models/Analytics.ts'), analyticsModel);

// Skill, Experience, Certificate, Gallery placeholders
['Skill', 'Experience', 'Certificate', 'Gallery', 'Testimonial'].forEach(model => {
  const content = `import mongoose, { Schema, Document } from 'mongoose';

export interface I${model} extends Document {
  title: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  isDeleted: boolean;
}

const ${model}Schema = new Schema<I${model}>({
  title: { type: String, required: true },
  status: { type: String, enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'], default: 'PUBLISHED' },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

export const ${model} = mongoose.model<I${model}>('${model}', ${model}Schema);
`;
  fs.writeFileSync(path.join(serverSrc, 'models/' + model + '.ts'), content);
});

// Architecture Docs
const architectureDoc = `# Phase 6: CMS Portfolio & Analytics Architecture

## Global Search & Filter Engine Contracts
Shared generic interface for searching \`Projects\`, \`Blogs\`, and \`Certificates\`.
- **Query Params**: \`?q=keyword&category=web&tags=react,node&sort=-createdAt&page=1&limit=10\`
- **Database Abstraction**: The \`BaseRepository.findAll\` will dynamically parse \`tags\` ($in) and \`q\` ($text or $regex) into MongoDB filters.

## Data Fetching Strategy (Next.js Server Components)
- Public routes (\`/projects\`, \`/blogs\`) will use standard \`fetch\` with Next.js revalidation (ISR) to cache responses and maintain SEO optimization.
- Missing pages or errors will default to React Suspense boundaries (\`loading.tsx\`) and error boundaries (\`error.tsx\`).
- Empty states handled conditionally on the server before emitting the UI.

## Home Page Composition
1. **Hero**: Fetches data from \`Profile\` (headline, bio, availabilityStatus).
2. **Featured Projects**: \`/api/v1/projects?featured=true&limit=3\`
3. **Quick Stats**: Summarized metrics from \`Repository\` and \`Analytics\`.
4. **Skills/Experience Preview**: Summarized limit queries.

## API Contracts (Phase 6 Modules)
- \`GET /api/v1/profile\` -> Fetches personal profile singleton
- \`PATCH /api/v1/profile\` -> Updates profile (Admin)
- \`GET /api/v1/blogs\` -> Fetches paginated blogs with search/filter engine
- \`POST /api/v1/messages\` -> Contact form submit with Email triggering queue
- \`POST /api/v1/analytics/track\` -> Fire and forget event tracking schema
`;
fs.writeFileSync(path.join(serverDocs, 'phase6-architecture.md'), architectureDoc);


// ==============================
// 2. FRONTEND ADMIN CMS PAGES (WEB)
// ==============================

const adminPages = ['skills', 'experiences', 'blogs', 'certificates', 'gallery', 'testimonials', 'messages', 'analytics', 'settings', 'profile'];

adminPages.forEach(page => {
  const cap = page.charAt(0).toUpperCase() + page.slice(1);
  const content = `export default function Admin${cap}Page() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">${cap} Management</h1>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">Create New</button>
      </div>
      <div className="border border-border rounded-lg bg-card p-6">
        <p className="text-muted-foreground">${cap} Data Table & CMS Foundation</p>
      </div>
    </div>
  );
}`;
  fs.writeFileSync(path.join(webSrc, 'app/admin/' + page + '/page.tsx'), content);
});

// Blog Public Pages
const blogPage = `export default function BlogsCatalog() {
  return (
    <section className="flex flex-col gap-6 py-8">
      <h1 className="text-4xl font-bold tracking-tight">Technical Blog</h1>
      <div className="grid gap-6">
        {/* Placeholder List */}
        <div className="h-48 border border-border bg-card p-6 rounded-lg">Blog Post Preview</div>
        <div className="h-48 border border-border bg-card p-6 rounded-lg">Blog Post Preview</div>
      </div>
    </section>
  );
}`;
fs.writeFileSync(path.join(webSrc, 'app/blogs/page.tsx'), blogPage);

const blogSlugPage = `export default function BlogPost({ params }: { params: { slug: string } }) {
  return (
    <article className="max-w-3xl mx-auto py-8 flex flex-col gap-6">
      <h1 className="text-4xl font-bold">{params.slug}</h1>
      <div className="prose dark:prose-invert mt-8">
        <p>Markdown blog content rendered here...</p>
      </div>
    </article>
  );
}`;
fs.writeFileSync(path.join(webSrc, 'app/blogs/[slug]/page.tsx'), blogSlugPage);

// Zustand Stores
const createStore = (name) => `import { create } from 'zustand';

interface ${name}State {
  data: any[];
  isLoading: boolean;
  error: string | null;
  set${name}: (data: any[]) => void;
  setLoading: (status: boolean) => void;
  setError: (error: string) => void;
}

export const use${name}Store = create<${name}State>((set) => ({
  data: [],
  isLoading: false,
  error: null,
  set${name}: (data) => set({ data }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
`;

['Profile', 'Blog', 'Analytics', 'Skill', 'Gallery'].forEach(store => {
  fs.writeFileSync(path.join(webSrc, 'lib/store/' + store.toLowerCase() + '.ts'), createStore(store));
});

console.log('Phase 6 Scaffold complete.');
