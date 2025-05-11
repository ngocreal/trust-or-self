import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import UserModel from '@/models/User';
import bcrypt from 'bcryptjs';

export async function PUT(req: NextRequest) {
  await connectDB();
  const { username, currentPassword, newPassword } = await req.json();
  const user = await UserModel.findOne({ username });
  if (!user || !user.password || !(await bcrypt.compare(currentPassword, user.password))) {
    return NextResponse.json({ success: false, message: 'Sai mật khẩu hiện tại' }, { status: 401 });
  }
  if (newPassword.length < 8 || !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(newPassword)) {
    return NextResponse.json({ success: false, message: 'Mật khẩu mới không hợp lệ' }, { status: 400 });
  }
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  return NextResponse.json({ success: true });
}