import mongoose, { Schema, Document } from 'mongoose';

export interface IGallery extends Document {
  title: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  isDeleted: boolean;
}

const GallerySchema = new Schema<IGallery>({
  title: { type: String, required: true },
  status: { type: String, enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'], default: 'PUBLISHED' },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

export const Gallery = mongoose.model<IGallery>('Gallery', GallerySchema);
