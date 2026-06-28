import mongoose, { Schema, Document } from 'mongoose';

export interface IVisit extends Document {
  path: string;
  referrer: string;
  userAgent: string;
  ipHash: string; // Hashed IP for privacy
  country?: string;
  city?: string;
  deviceType: 'DESKTOP' | 'MOBILE' | 'TABLET' | 'UNKNOWN';
  browser: string;
  os: string;
  duration?: number;
  timestamp: Date;
}

const VisitSchema = new Schema<IVisit>({
  path: { type: String, required: true, index: true },
  referrer: { type: String, default: '' },
  userAgent: { type: String, required: true },
  ipHash: { type: String, required: true },
  country: { type: String },
  city: { type: String },
  deviceType: { 
    type: String, 
    enum: ['DESKTOP', 'MOBILE', 'TABLET', 'UNKNOWN'],
    default: 'UNKNOWN' 
  },
  browser: { type: String, default: 'Unknown' },
  os: { type: String, default: 'Unknown' },
  duration: { type: Number }, // seconds
  timestamp: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

// Index for daily/monthly aggregation queries
VisitSchema.index({ timestamp: -1, path: 1 });
VisitSchema.index({ timestamp: -1 });
VisitSchema.index({ path: 1 });
VisitSchema.index({ ipHash: 1 });

export const Visit = mongoose.models.Visit || mongoose.model<IVisit>('Visit', VisitSchema);
