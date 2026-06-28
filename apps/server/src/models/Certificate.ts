import mongoose, { Schema, Document } from 'mongoose';

export interface ICertificate extends Document {
  title: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  isDeleted: boolean;
}

const CertificateSchema = new Schema<ICertificate>({
  title: { type: String, required: true },
  status: { type: String, enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'], default: 'PUBLISHED' },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

export const Certificate = mongoose.model<ICertificate>('Certificate', CertificateSchema);
