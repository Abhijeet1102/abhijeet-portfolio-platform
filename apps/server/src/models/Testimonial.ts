import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
  title: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  isDeleted: boolean;
}

const TestimonialSchema = new Schema<ITestimonial>({
  title: { type: String, required: true },
  status: { type: String, enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'], default: 'PUBLISHED' },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

export const Testimonial = mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
