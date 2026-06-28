const fs = require('fs');
const path = require('path');

const serverSrc = path.join(__dirname, 'apps/server/src');
const webSrc = path.join(__dirname, 'apps/web/src');
const serverDocs = path.join(__dirname, 'apps/server/docs');

// Create required directories
const dirs = [
  path.join(serverSrc, 'github'),
  path.join(serverSrc, 'projects'),
  path.join(serverSrc, 'models'),
  path.join(webSrc, 'app/admin/projects/new'),
  path.join(webSrc, 'app/admin/projects/[id]'),
  path.join(webSrc, 'app/projects/[slug]'),
];
dirs.forEach(dir => fs.mkdirSync(dir, { recursive: true }));

// ==============================
// 1. BACKEND PROJECTS & GITHUB CMS
// ==============================

// Extensive Project Model
const projectModel = `import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription?: string;
  category: 'WEB' | 'AI' | 'MOBILE' | 'FULLSTACK' | 'OPENSOURCE' | 'EXPERIMENTAL';
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  featured: boolean;
  technologies: string[];
  tags: string[];
  coverImage?: string;
  gallery: string[];
  githubRepository?: string;
  liveDemo?: string;
  caseStudy?: string;
  problemStatement?: string;
  solution?: string;
  architecture?: string;
  features: string[];
  challenges: string[];
  learnings: string[];
  metrics: string[];
  startDate?: Date;
  endDate?: Date;
  publishedAt?: Date;
  isDeleted: boolean; // Soft delete
}

const ProjectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  shortDescription: { type: String, required: true },
  fullDescription: { type: String },
  category: { type: String, enum: ['WEB', 'AI', 'MOBILE', 'FULLSTACK', 'OPENSOURCE', 'EXPERIMENTAL'], default: 'WEB' },
  status: { type: String, enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'], default: 'DRAFT', index: true },
  featured: { type: Boolean, default: false, index: true },
  technologies: [{ type: String }],
  tags: [{ type: String }],
  coverImage: { type: String },
  gallery: [{ type: String }],
  githubRepository: { type: String },
  liveDemo: { type: String },
  caseStudy: { type: String },
  problemStatement: { type: String },
  solution: { type: String },
  architecture: { type: String },
  features: [{ type: String }],
  challenges: [{ type: String }],
  learnings: [{ type: String }],
  metrics: [{ type: String }],
  startDate: { type: Date },
  endDate: { type: Date },
  publishedAt: { type: Date },
  isDeleted: { type: Boolean, default: false, index: true },
}, { timestamps: true });

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
`;
fs.writeFileSync(path.join(serverSrc, 'models/Project.ts'), projectModel);

// Repository Model (GitHub Sync)
const repoModel = `import mongoose, { Schema, Document } from 'mongoose';

export interface IRepository extends Document {
  githubId: string;
  name: string;
  fullName: string;
  description?: string;
  htmlUrl: string;
  homepage?: string;
  topics: string[];
  language?: string;
  languages: Record<string, number>;
  stargazersCount: number;
  forksCount: number;
  openIssuesCount: number;
  defaultBranch: string;
  license?: string;
  readme?: string;
  lastSyncedAt: Date;
  pushedAt: Date;
}

const RepositorySchema = new Schema<IRepository>({
  githubId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  fullName: { type: String, required: true },
  description: { type: String },
  htmlUrl: { type: String, required: true },
  homepage: { type: String },
  topics: [{ type: String }],
  language: { type: String },
  languages: { type: Schema.Types.Mixed },
  stargazersCount: { type: Number, default: 0 },
  forksCount: { type: Number, default: 0 },
  openIssuesCount: { type: Number, default: 0 },
  defaultBranch: { type: String, default: 'main' },
  license: { type: String },
  readme: { type: String },
  lastSyncedAt: { type: Date, default: Date.now },
  pushedAt: { type: Date },
}, { timestamps: true });

export const Repository = mongoose.model<IRepository>('Repository', RepositorySchema);
`;
fs.writeFileSync(path.join(serverSrc, 'models/Repository.ts'), repoModel);

// GitHub Auto-Sync Service Architecture
const githubService = `export class GitHubService {
  static async fetchRepositories() { return []; }
  static async fetchReadme(repoName: string) { return ""; }
  static async fetchLanguages(repoName: string) { return {}; }
}

export class ProjectSyncService {
  static async syncRepositoryToProject(repo: any) { 
    // Flow: Repository updates -> Update or Create Draft Project
    return { success: true }; 
  }
}
`;
fs.writeFileSync(path.join(serverSrc, 'github/github.service.ts'), githubService);

// Webhook Controller Placeholder
const webhookController = `export class WebhookController {
  static async handleGithubWebhook(req: any, res: any) {
    const event = req.headers['x-github-event'];
    // Flow: Git Push -> Webhook -> Mongo Update -> Cache Refresh -> Portfolio
    if (event === 'push') {
      // Trigger sync
    }
    return res.status(200).json({ received: true });
  }
}
`;
fs.writeFileSync(path.join(serverSrc, 'github/webhook.controller.ts'), webhookController);

// API Contracts Document
const apiContract = `# Phase 5: Projects CMS & GitHub Engine

## Project States Flow
\`\`\`mermaid
stateDiagram-v2
    [*] --> DRAFT: Created
    DRAFT --> PUBLISHED: Publish
    PUBLISHED --> DRAFT: Unpublish
    PUBLISHED --> ARCHIVED: Archive
    ARCHIVED --> PUBLISHED: Restore
    ARCHIVED --> [*]: Soft Delete
\`\`\`

## GitHub Webhook Synchronization Flow
\`\`\`mermaid
sequenceDiagram
    participant GH as GitHub
    participant Hook as WebhookController
    participant Sync as ProjectSyncService
    participant DB as MongoDB
    
    GH->>Hook: POST /api/v1/github/webhooks (push event)
    Hook->>Sync: Trigger Repository Sync
    Sync->>GH: Fetch Readme & Languages
    GH-->>Sync: Return Meta
    Sync->>DB: Update Repository & Project Metrics
    Sync-->>Hook: Sync Complete
    Hook-->>GH: 200 OK
\`\`\`

## API Contracts

### Projects
- \`GET /api/v1/projects\` -> Fetch dynamic projects (featured, latest, filtered)
- \`GET /api/v1/projects/:slug\` -> View single project
- \`POST /api/v1/projects\` -> Create project (Admin)
- \`PATCH /api/v1/projects/:id\` -> Update project (Admin)
- \`DELETE /api/v1/projects/:id\` -> Soft Delete
- \`POST /api/v1/projects/:id/publish\` -> Change status to PUBLISHED
- \`POST /api/v1/projects/:id/archive\` -> Change status to ARCHIVED

### GitHub
- \`GET /api/v1/github/repositories\` -> Fetch cached repositories
- \`POST /api/v1/github/sync\` -> Force manual sync
- \`POST /api/v1/github/webhooks\` -> Handle GitHub hooks
- \`GET /api/v1/github/stats\` -> Overview metrics (commits, stars)
`;
fs.writeFileSync(path.join(serverDocs, 'projects-github-architecture.md'), apiContract);

// ==============================
// 2. FRONTEND PROJECTS & ADMIN
// ==============================

// Admin Projects Dashboard
const adminProjectsPage = `export default function AdminProjectsDashboard() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects CMS</h1>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">Create Project</button>
      </div>
      <div className="border border-border rounded-lg bg-card p-6">
        <p className="text-muted-foreground">Projects Data Table Foundation</p>
      </div>
    </div>
  );
}`;
fs.writeFileSync(path.join(webSrc, 'app/admin/projects/page.tsx'), adminProjectsPage);

const adminProjectsNewPage = `export default function AdminNewProject() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">New Project</h1>
      <div className="border border-border rounded-lg bg-card p-6">
        <p className="text-muted-foreground">Project Editor Foundation</p>
      </div>
    </div>
  );
}`;
fs.writeFileSync(path.join(webSrc, 'app/admin/projects/new/page.tsx'), adminProjectsNewPage);

const adminProjectsEditPage = `export default function AdminEditProject({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Project: {params.id}</h1>
      <div className="border border-border rounded-lg bg-card p-6">
        <p className="text-muted-foreground">Project Editor Foundation</p>
      </div>
    </div>
  );
}`;
fs.writeFileSync(path.join(webSrc, 'app/admin/projects/[id]/page.tsx'), adminProjectsEditPage);

// Public Projects Pages
const projectsPage = `export default function ProjectsCatalog() {
  return (
    <section className="flex flex-col gap-6 py-8">
      <h1 className="text-4xl font-bold tracking-tight">Dynamic Portfolio Engine</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 border border-border p-4 rounded-lg bg-card">
          <p className="font-semibold mb-2">Filters</p>
          {/* Categories, Tags */}
        </div>
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="h-48 border border-border bg-muted/20 rounded-lg"></div>
          <div className="h-48 border border-border bg-muted/20 rounded-lg"></div>
          <div className="h-48 border border-border bg-muted/20 rounded-lg"></div>
        </div>
      </div>
    </section>
  );
}`;
fs.writeFileSync(path.join(webSrc, 'app/projects/page.tsx'), projectsPage);

const projectSlugPage = `export default function ProjectDetail({ params }: { params: { slug: string } }) {
  return (
    <article className="max-w-4xl mx-auto py-8 flex flex-col gap-6">
      <div className="h-64 w-full bg-muted border border-border rounded-lg mb-4"></div>
      <h1 className="text-4xl font-bold">{params.slug}</h1>
      <div className="flex gap-2">
        <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm">React</span>
        <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm">Node.js</span>
      </div>
      <div className="prose dark:prose-invert mt-8">
        <p>Full project case study description goes here...</p>
      </div>
    </article>
  );
}`;
fs.writeFileSync(path.join(webSrc, 'app/projects/[slug]/page.tsx'), projectSlugPage);

console.log('Phase 5 Scaffold complete.');
