import mongoose, { Schema, model, models, Document, Model } from "mongoose";

export interface IPendingVerification extends Document {
  email: string;
  nickname: string;
  passwordHash: string;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
}

const PendingVerificationSchema = new Schema<IPendingVerification>({
  email: { type: String, required: true, unique: true, index: true },
  nickname: { type: String, required: true },
  passwordHash: { type: String, required: true },
  tokenHash: { type: String, required: true, index: true },
  expiresAt: { type: Date, required: true, index: true }, 
  createdAt: { type: Date, default: Date.now },
});

export default (models.PendingVerification as Model<IPendingVerification>) ||
  model<IPendingVerification>("PendingVerification", PendingVerificationSchema);