const fs = require('fs');
const path = require('path');

const serverSrc = path.join(__dirname, 'apps/server/src');
const serverDocs = path.join(__dirname, 'apps/server/docs');

// Create directories
const dirs = [
  'models',
  'repositories',
  'services',
  'controllers',
  'routes/v1',
  'validators',
  'types',
  'constants',
  'config'
];

dirs.forEach(dir => {
  fs.mkdirSync(path.join(serverSrc, dir), { recursive: true });
});
fs.mkdirSync(serverDocs, { recursive: true });

// 1. Constants
const constantsContent = `export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

export const ERROR_CODES = {
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
};

export const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
};
`;
fs.writeFileSync(path.join(serverSrc, 'constants/index.ts'), constantsContent);

// 2. Types
const typesContent = `export interface IPaginationOptions {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface IBaseResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}
`;
fs.writeFileSync(path.join(serverSrc, 'types/index.ts'), typesContent);

// 3. Database Connection
const dbConfigContent = `import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';
    await mongoose.connect(uri);
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};
`;
fs.writeFileSync(path.join(serverSrc, 'config/db.ts'), dbConfigContent);

// 4. Base Repository
const baseRepoContent = `import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';
import { IPaginationOptions } from '../types';

export class BaseRepository<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    const document = new this.model(data);
    return await document.save();
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id).exec();
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return await this.model.findOne(filter).exec();
  }

  async findAll(filter: FilterQuery<T> = {}, options: IPaginationOptions = {}): Promise<{ data: T[]; total: number }> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;
    
    const sort: any = {};
    if (options.sort) {
      sort[options.sort] = options.order === 'desc' ? -1 : 1;
    }

    const [data, total] = await Promise.all([
      this.model.find(filter).sort(sort).skip(skip).limit(limit).exec(),
      this.model.countDocuments(filter).exec()
    ]);

    return { data, total };
  }

  async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
`;
fs.writeFileSync(path.join(serverSrc, 'repositories/BaseRepository.ts'), baseRepoContent);

// 5. Mongoose Schemas (User & Project as examples)
const userModelContent = `import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'ADMIN' | 'USER';
  oauthProvider?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, select: false },
  role: { type: String, enum: ['ADMIN', 'USER'], default: 'USER' },
  oauthProvider: { type: String },
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', UserSchema);
`;
fs.writeFileSync(path.join(serverSrc, 'models/User.ts'), userModelContent);

const projectModelContent = `import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  slug: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  images: string[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String, required: true },
  techStack: [{ type: String }],
  githubUrl: { type: String },
  liveUrl: { type: String },
  images: [{ type: String }],
  featured: { type: Boolean, default: false, index: true },
}, { timestamps: true });

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
`;
fs.writeFileSync(path.join(serverSrc, 'models/Project.ts'), projectModelContent);

// 6. DTOs (Zod)
const projectDtoContent = `import { z } from 'zod';

export const createProjectSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    techStack: z.array(z.string()).min(1, "At least one technology is required"),
    githubUrl: z.string().url().optional(),
    liveUrl: z.string().url().optional(),
    images: z.array(z.string().url()).optional(),
    featured: z.boolean().default(false),
  })
});

export const updateProjectSchema = z.object({
  body: createProjectSchema.shape.body.partial(),
  params: z.object({
    id: z.string().min(1, "ID is required")
  })
});

export type CreateProjectDto = z.infer<typeof createProjectSchema>['body'];
export type UpdateProjectDto = z.infer<typeof updateProjectSchema>['body'];
`;
fs.writeFileSync(path.join(serverSrc, 'validators/project.dto.ts'), projectDtoContent);

// 7. API Contract Document
const apiContractContent = `# API Contracts & Database ERD

## Entity Relationship Diagram
\`\`\`mermaid
erDiagram
    USERS ||--o{ BLOGS : writes
    USERS {
        ObjectId _id
        string name
        string email
        string role
        date createdAt
    }
    PROJECTS {
        ObjectId _id
        string title
        string slug
        string[] techStack
        boolean featured
    }
    SKILLS {
        ObjectId _id
        string name
        string category
        number proficiency
    }
    BLOGS {
        ObjectId _id
        string title
        string slug
        ObjectId author
        boolean published
    }
    MESSAGES {
        ObjectId _id
        string email
        string message
        boolean read
    }
    ANALYTICS {
        ObjectId _id
        string page
        string visitorId
        date timestamp
    }
\`\`\`

## REST API Contracts (/api/v1)

### Projects Module
| Method | Endpoint | Query Params | Request Body | Description |
|---|---|---|---|---|
| GET | \`/projects\` | \`page, limit, sort, featured\` | None | Fetch paginated projects |
| GET | \`/projects/:slug\` | None | None | Fetch single project by slug |
| POST | \`/projects\` | None | \`CreateProjectDto\` | Create new project (Admin) |
| PUT | \`/projects/:id\` | None | \`UpdateProjectDto\` | Update project (Admin) |
| DELETE | \`/projects/:id\` | None | None | Delete project (Admin) |

### Messages Module (Contact)
| Method | Endpoint | Query Params | Request Body | Description |
|---|---|---|---|---|
| POST | \`/messages\` | None | \`{ name, email, subject, message }\` | Submit contact form |
| GET | \`/messages\` | \`page, limit, unreadOnly\` | None | View messages (Admin) |

*(Similar contracts apply to Skills, Experiences, Blogs, Certificates, etc., utilizing standard CRUD DTO patterns)*
`;
fs.writeFileSync(path.join(serverDocs, 'api-contract.md'), apiContractContent);

console.log('Phase 3 Scaffold complete.');
