import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://127.0.0.1:27017/clientsdb'; 

if (!MONGODB_URI) {
  throw new Error('MongoDB URI not defined');
}

declare global {
  var mongooseGlobal: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

let cached = global.mongooseGlobal || { conn: null, promise: null };
global.mongooseGlobal = cached;

async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;