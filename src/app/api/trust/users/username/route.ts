import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import UserModel from '@/models/User';
import bcrypt from 'bcryptjs';

export async function PUT(req: NextRequest) {
  await connectDB();
  const { oldUsername, newUsername, password } = await req.json();
  const user = await UserModel.findOne({ username: oldUsername });
  if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ success: false, message: 'Sai mật khẩu hoặc không tìm thấy user' }, { status: 401 });
  }
  user.username = newUsername;
  await user.save();
  return NextResponse.json({ success: true, username: newUsername });
}