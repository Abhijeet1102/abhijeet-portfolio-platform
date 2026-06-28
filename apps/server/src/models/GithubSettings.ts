import mongoose, { Schema, Document } from 'mongoose';

export interface IGithubSettings extends Document {
  connected: boolean;
  username?: string;
  avatarUrl?: string;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiresAt?: Date;
  autoSync: boolean;
  syncInterval: number; // in hours
}

const GithubSettingsSchema = new Schema<IGithubSettings>({
  connected: { type: Boolean, default: false },
  username: { type: String },
  avatarUrl: { type: String },
  accessToken: { type: String },
  refreshToken: { type: String },
  tokenExpiresAt: { type: Date },
  autoSync: { type: Boolean, default: true },
  syncInterval: { type: Number, default: 24 },
}, { timestamps: true });

export const GithubSettings = mongoose.model<IGithubSettings>('GithubSettings', GithubSettingsSchema);
