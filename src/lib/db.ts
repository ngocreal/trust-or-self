import mongoose from 'mongoose';

type ConnectionType = {
  conn: typeof mongoose | null;
  promise: Promise<ConnectionType> | null;
};

const db: ConnectionType = {
  conn: null,
  promise: null,
};

async function connectDB(): Promise<ConnectionType> {
  if (db.conn) {
    return db;
  }

  if (!db.promise) {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/trust-or-self';
    db.promise = mongoose.connect(uri).then((mongooseInstance) => {
      db.conn = mongooseInstance;
      return db;
    }).catch((err) => {
      console.error('MongoDB connection error:', err);
      throw err;
    });
  }

  await db.promise;
  return db;
}

export default connectDB;