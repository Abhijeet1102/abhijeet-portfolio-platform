import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalytics extends Document {
  eventType: 'PAGE_VIEW' | 'PROJECT_VIEW' | 'BLOG_VIEW' | 'RESUME_DOWNLOAD';
  resourceId?: string; // slug or ID
  visitorId: string; // Hash or session token
  deviceInfo: {
    browser?: string;
    os?: string;
    deviceType?: 'DESKTOP' | 'MOBILE' | 'TABLET';
  };
  referrer?: string;
  country?: string;
}

const AnalyticsSchema = new Schema<IAnalytics>({
  eventType: { type: String, required: true, index: true },
  resourceId: { type: String, index: true },
  visitorId: { type: String, required: true, index: true },
  deviceInfo: { type: Schema.Types.Mixed, default: {} },
  referrer: { type: String },
  country: { type: String },
}, { timestamps: true });

export const Analytics = mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);
