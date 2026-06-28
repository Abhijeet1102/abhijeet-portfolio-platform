import mongoose, { Schema, Document } from 'mongoose';

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
