import mongoose, { Schema, Document } from 'mongoose';

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
  stargazersCount?: number;
  forksCount?: number;
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
  stargazersCount: { type: Number, default: 0 },
  forksCount: { type: Number, default: 0 },
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
