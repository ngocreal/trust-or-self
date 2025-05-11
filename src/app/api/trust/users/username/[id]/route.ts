import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import UserModel from '@/models/User';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const user = await UserModel.findById(params.id).select('-password');
  if (!user) {
    return NextResponse.json({ success: false, message: 'Không tìm thấy user' }, { status: 404 });
  }
  return NextResponse.json({ success: true, username: user.username, ...user.toObject() });
}