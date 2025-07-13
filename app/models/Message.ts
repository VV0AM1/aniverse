import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  sender: string;
  receiver: string;
  content: string;
  timestamp: Date;
  room?: string;
  read?: boolean;
}

const MessageSchema: Schema = new Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  room: { type: String },
  read: { type: Boolean, default: false },
});

export default mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);