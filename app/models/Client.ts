import {
  Schema, model, models, type Document, type Model, Types,
} from "mongoose";

export interface IAnimeStatus {
  watched: string[];
  liked: string[];
  later: string[];
  bookmark: string[];
}

export interface IClient extends Document {
  nickname: string;
  email: string;
  password: string;        // hashed
  avatar?: string;
  isVerified: boolean;
  bio?: string;            // 👈 add
  dob?: string;            // 👈 add (or Date if you prefer)
  gender?: string;         // 👈 add
  otp?: string | null;
  otpExpiry?: number | null;
  friends: Types.ObjectId[];
  animeStatus: IAnimeStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema = new Schema<IClient>(
  {
    nickname: { type: String, required: true },
    email: { type: String, unique: true, required: true, index: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "" },
    isVerified: { type: Boolean, default: false },
    bio: { type: String, default: "" },        // 👈 add
    dob: { type: String, default: "" },        // 👈 add (or Date)
    gender: { type: String, default: "" },     // 👈 add
    otp: { type: String, default: null },
    otpExpiry: { type: Number, default: null },
    friends: [{ type: Schema.Types.ObjectId, ref: "Client", default: [] }],
    animeStatus: {
      watched: { type: [String], default: [] },
      liked: { type: [String], default: [] },
      later: { type: [String], default: [] },
      bookmark: { type: [String], default: [] },
    },
  },
  { timestamps: true }
);

const Client =
  (models.Client as Model<IClient>) || model<IClient>("Client", ClientSchema);

export default Client;
