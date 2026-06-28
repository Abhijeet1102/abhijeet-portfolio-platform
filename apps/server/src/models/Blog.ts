import mongoose, { Schema, Document } from 'mongoose';

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

BlogSchema.index({ slug: 1 });
BlogSchema.index({ status: 1 });

export const Blog = mongoose.model<IBlog>('Blog', BlogSchema);
