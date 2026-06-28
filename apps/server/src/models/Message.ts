import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED';
  repliedAt?: Date;
  replyContent?: string;
}

const MessageSchema = new Schema<IMessage>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String },
  message: { type: String, required: true },
  status: { type: String, enum: ['NEW', 'READ', 'REPLIED', 'ARCHIVED'], default: 'NEW', index: true },
  repliedAt: { type: Date },
  replyContent: { type: String },
}, { timestamps: true });

export const Message = mongoose.model<IMessage>('Message', MessageSchema);
