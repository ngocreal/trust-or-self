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
    const question = new QuestionsModel(body);
    await question.save();
    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add question' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { _id, ...updates } = await req.json();
    const question = await QuestionsModel.findByIdAndUpdate(_id, updates, { new: true });
    return NextResponse.json(question || { message: 'Question not found' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update question' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { _id } = await req.json();
    await QuestionsModel.findByIdAndDelete(_id);
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete question' }, { status: 500 });
  }
}