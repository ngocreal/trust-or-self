import { NextRequest, NextResponse } from 'next/server';
import QuestionsModel from '@/models/Questions';
import connectDB from '@/lib/db';

export async function GET() {
  try {
    await connectDB();
    const questions = await QuestionsModel.find();
    return NextResponse.json(questions.length ? questions : { message: 'No questions found' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    console.log('POST body:', body);
    if (!body._id?.trim()) {
      return NextResponse.json({ error: 'Mã câu hỏi không được để trống' }, { status: 400 });
    }
    if (!body.content?.trim()) {
      return NextResponse.json({ error: 'Nội dung không được để trống' }, { status: 400 });
    }
    const existingQuestion = await QuestionsModel.findById(body._id);
    if (existingQuestion) {
      return NextResponse.json({ error: 'Mã câu hỏi đã tồn tại' }, { status: 400 });
    }
    const question = new QuestionsModel(body);
    await question.save();
    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error('Error adding question:', error);
    return NextResponse.json({ error: 'Failed to add question', details: String(error) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { _id, ...updates } = await req.json();
    if (!_id?.trim()) {
      return NextResponse.json({ error: 'Mã câu hỏi không được để trống' }, { status: 400 });
    }
    if (!updates.content?.trim()) {
      return NextResponse.json({ error: 'Nội dung không được để trống' }, { status: 400 });
    }
    const question = await QuestionsModel.findByIdAndUpdate(_id, updates, { new: true });
    return NextResponse.json(question || { message: 'Question not found' });
  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json({ error: 'Failed to update question', details: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { _id } = await req.json();
    await QuestionsModel.findByIdAndDelete(_id);
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    console.error('Error deleting question:', error);
    return NextResponse.json({ error: 'Failed to delete question', details: String(error) }, { status: 500 });
  }
}