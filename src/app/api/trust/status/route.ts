import { NextRequest, NextResponse } from 'next/server';
import StatusModel from '@/models/Status';
import QuestionsModel from '@/models/Questions';
import connectDB from '@/lib/db';

export async function GET() {
  try {
    await connectDB();
    const statuses = await StatusModel.find();
    return NextResponse.json(statuses.length ? statuses : { message: 'No statuses found' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch statuses' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { question_id } = body;

    // Validate question_id exists in Questions
    const questionExists = await QuestionsModel.findById(question_id);
    if (!questionExists) {
      return NextResponse.json({ error: 'Question ID does not exist' }, { status: 400 });
    }

    // Check if a status already exists for this question_id
    const existingStatus = await StatusModel.findOne({ question_id });
    if (existingStatus) {
      return NextResponse.json({ error: 'Status already exists for this question_id' }, { status: 400 });
    }

    const status = new StatusModel({ ...body, count_a: 50, count_b: 50 });
    await status.save();
    return NextResponse.json(status, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add status' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { _id, question_id, count_a, count_b } = body;

    // Validate question_id exists in Questions
    const questionExists = await QuestionsModel.findById(question_id);
    if (!questionExists) {
      return NextResponse.json({ error: 'Question ID does not exist' }, { status: 400 });
    }

    const status = await StatusModel.findByIdAndUpdate(
      _id,
      { question_id, count_a, count_b },
      { new: true }
    );
    if (!status) {
      return NextResponse.json({ error: 'Status not found' }, { status: 404 });
    }
    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}

// New endpoint for user interactions (Trust/Self selection)
export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const { question_id, choice } = await req.json();

    // Validate question_id exists in Questions
    const questionExists = await QuestionsModel.findById(question_id);
    if (!questionExists) {
      return NextResponse.json({ error: 'Question ID does not exist' }, { status: 400 });
    }

    // Find or create status for this question_id
    let status = await StatusModel.findOne({ question_id });
    if (!status) {
      status = new StatusModel({ question_id, count_a: 50, count_b: 50 });
    }

    // Increment counts based on user choice
    if (choice === 'trust') {
      status.count_a += 1;
    } else if (choice === 'self') {
      status.count_b += 1;
    } else {
      return NextResponse.json({ error: 'Invalid choice' }, { status: 400 });
    }

    await status.save();
    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update status counts' }, { status: 500 });
  }
}