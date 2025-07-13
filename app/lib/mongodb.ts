import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('❌ MongoDB URI not defined in environment variables.');
}

// Tell TypeScript: we already made sure it's a string
const uri: string = MONGODB_URI;

interface MongooseGlobal {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Add to global scope to avoid re-connecting during hot reload in dev
declare global {
  // eslint-disable-next-line no-var
  var mongooseGlobal: MongooseGlobal | undefined;
}

const globalWithMongoose = global as typeof globalThis & {
  mongooseGlobal: MongooseGlobal;
};

if (!globalWithMongoose.mongooseGlobal) {
  globalWithMongoose.mongooseGlobal = {
    conn: null,
    promise: null,
  };
}

async function dbConnect() {
  const cached = globalWithMongoose.mongooseGlobal;

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;