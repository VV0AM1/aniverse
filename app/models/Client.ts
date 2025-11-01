import mongoose from 'mongoose';

const ClientSchema = new mongoose.Schema({
  nickname: String,
  email: { type: String, unique: true },
  password: String,
  avatar: String,
  otp: { type: String },
  otpExpiry: { type: Number },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Client' }],
  animeStatus: {
    watched: [{ type: String }], 
    liked: [{ type: String }],
    later: [{ type: String }],
    bookmark: [{ type: String }]
  }
  
});

export default mongoose.models.Client || mongoose.model('Client', ClientSchema);