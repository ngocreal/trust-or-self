import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import StatusModel from '@/models/Status';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const status = await StatusModel.findById(params.id);
  return NextResponse.json(status);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  await dbConnect();
  const updated = await StatusModel.findByIdAndUpdate(params.id, body, { new: true });
  return NextResponse.json(updated);
}
