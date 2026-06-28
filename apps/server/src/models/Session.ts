import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  user: mongoose.Types.ObjectId;
  refreshToken: string;
  userAgent: string;
  ipAddress: string;
  expiresAt: Date;
  isValid: boolean;
}

const SessionSchema = new Schema<ISession>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  refreshToken: { type: String, required: true },
  userAgent: { type: String },
  ipAddress: { type: String },
  expiresAt: { type: Date, required: true },
  isValid: { type: Boolean, default: true },
}, { timestamps: true });

export const Session = mongoose.model<ISession>('Session', SessionSchema);
