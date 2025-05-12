import { NextRequest, NextResponse } from 'next/server';
import StatusModel from '@/models/Status';
import QuestionsModel from '@/models/Questions'; 
import connectDB from '@/lib/db';

export async function GET() {
  try {
    await connectDB();
    const statuses = await StatusModel.find();
    return NextResponse.json(statuses.length ? statuses : { message: 'No statuses found' });
  } catch (error: unknown) { 
    console.error('Lỗi khi lấy danh sách trạng thái:', error);
    const errMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to fetch statuses', details: errMsg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { question_id, count_a, count_b } = body;

    if (!question_id) {
        return NextResponse.json({ error: 'question_id là bắt buộc.' }, { status: 400 });
    }

    const questionExists = await QuestionsModel.findById(question_id);
    if (!questionExists) {
      return NextResponse.json({ error: 'Question ID không tồn tại.' }, { status: 400 });
    }

    const existingStatus = await StatusModel.findOne({ question_id });
    if (existingStatus) {
      return NextResponse.json({ error: 'Trạng thái cho Question ID này đã tồn tại.' }, { status: 409 }); 
    }

    const newStatus = new StatusModel({
      question_id,
      count_a: count_a !== undefined ? count_a : 50, 
      count_b: count_b !== undefined ? count_b : 50, 
    });

    await newStatus.save(); 
    return NextResponse.json({ message: 'Trạng thái mới đã được thêm thành công.' }, { status: 201 });
  } catch (error: unknown) { 
    console.error('Lỗi khi thêm trạng thái mới:', error);
    // Check for MongoDB duplicate key error
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: number }).code === 11000
    ) {
      return NextResponse.json({ error: 'Trạng thái cho Question ID này đã tồn tại.' }, { status: 409 });
    }
    const errMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Lỗi server khi thêm trạng thái mới.', details: errMsg }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const { question_id, choice } = await req.json();

    const questionExists = await QuestionsModel.findById(question_id);
    if (!questionExists) {
      return NextResponse.json({ error: 'Question ID does not exist' }, { status: 400 });
    }

    let status = await StatusModel.findOne({ question_id });
    if (!status) {
      // Nếu không tìm thấy status, tạo mới với giá trị mặc định
      status = new StatusModel({ question_id, count_a: 50, count_b: 50 });
    }

    if (choice === 'trust') {
      status.count_a += 1;
    } else if (choice === 'self') {
      status.count_b += 1;
    } else {
      return NextResponse.json({ error: 'Invalid choice' }, { status: 400 });
    }

    await status.save();
    return NextResponse.json({ message: 'Status updated successfully', status: status.toObject() }, { status: 200 });
  } catch (error: unknown) { 
    console.error('Lỗi khi cập nhật số liệu trạng thái:', error);
    const errMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to update status counts', details: errMsg }, { status: 500 });
  }
}