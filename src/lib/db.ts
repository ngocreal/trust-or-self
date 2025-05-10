import mongoose from 'mongoose';

let isConnected = false;

export default async function connectDB() {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI!;
  try {
    await mongoose.connect(uri, {
      dbName: 'trust-or-self',
    });
    isConnected = true;
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}
