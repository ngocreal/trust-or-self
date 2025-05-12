import { NextRequest, NextResponse } from 'next/server';
import QuestionsModel from '@/models/Questions';
import connectDB from '@/lib/db';

interface Context {
  params: {
    id: string;
  };
}

export async function PUT(req: NextRequest, context: Context) {
  try {
    await connectDB();
    const { id } = context.params;
    const updates = await req.json();
    console.log('PUT body:', updates);
    if (updates._id && updates._id !== id) {
      return NextResponse.json({ error: 'Mismatched ID in path and body' }, { status: 400 });
    }
    if (!updates.content?.trim()) {
      return NextResponse.json({ error: 'Nội dung không được để trống' }, { status: 400 });
    }
    delete updates._id;
    const question = await QuestionsModel.findByIdAndUpdate(id, updates, { new: true });
    if (!question) {
      return NextResponse.json({ message: 'Question not found' }, { status: 404 });
    }
    return NextResponse.json(question);
  } catch (error: unknown) {
    console.error('Error updating question:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to update question', details: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: Context) {
  try {
    await connectDB();
    const { id } = context.params;
    const result = await QuestionsModel.findByIdAndDelete(id);
    if (!result) {
      return NextResponse.json({ message: 'Question not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error: unknown) {
    console.error('Error deleting question:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to delete question', details: message }, { status: 500 });
  }
}