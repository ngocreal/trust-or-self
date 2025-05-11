import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import UserModel from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  await connectDB();
  const { username, password } = await req.json();
  const user = await UserModel.findOne({ username });
  if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ success: false, message: 'Sai tài khoản hoặc mật khẩu' }, { status: 401 });
  }
  return NextResponse.json({ success: true, username });
}