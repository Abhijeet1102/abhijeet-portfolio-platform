import mongoose, { Schema, Document } from 'mongoose';

export interface ISkill extends Document {
  title: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  isDeleted: boolean;
}

const SkillSchema = new Schema<ISkill>({
  title: { type: String, required: true },
  status: { type: String, enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'], default: 'PUBLISHED' },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

export const Skill = mongoose.model<ISkill>('Skill', SkillSchema);
