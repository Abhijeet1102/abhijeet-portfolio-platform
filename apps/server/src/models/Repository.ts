import mongoose, { Schema, Document } from 'mongoose';

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
