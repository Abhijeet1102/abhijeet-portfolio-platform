import mongoose, { Schema, Document } from 'mongoose';

export interface IExperience extends Document {
  title: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  isDeleted: boolean;
}

const ExperienceSchema = new Schema<IExperience>({
  title: { type: String, required: true },
  status: { type: String, enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'], default: 'PUBLISHED' },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

export const Experience = mongoose.model<IExperience>('Experience', ExperienceSchema);
