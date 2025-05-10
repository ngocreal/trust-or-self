import { NextRequest, NextResponse } from 'next/server';
import StatusModel from '@/models/Status';
import QuestionsModel from '@/models/Questions'; 
import connectDB from '@/lib/db';

interface Context {
  params: {
    id: string; 
  };
}

export async function GET(req: NextRequest, context: Context) {
  try {
    await connectDB();
    const { id } = context.params;
    const status = await StatusModel.findById(id);
    if (!status) {
      return NextResponse.json({ message: 'Status not found' }, { status: 404 });
    }
    return NextResponse.json(status);
  } catch (error: any) { 
    console.error('Lỗi khi lấy trạng thái theo ID:', error);
    return NextResponse.json({ error: 'Failed to fetch status', details: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: Context) {
  try {
    await connectDB();
    const { id } = context.params; 
    const body = await req.json();
    const { question_id, count_a, count_b } = body; 

    if (question_id) {
      const questionExists = await QuestionsModel.findById(question_id);
      if (!questionExists) {
        return NextResponse.json({ error: 'Question ID không tồn tại.' }, { status: 400 });
      }
    }

    const status = await StatusModel.findByIdAndUpdate(
      id, 
      { question_id, count_a, count_b },
      { new: true, runValidators: true } 
    );

    if (!status) {
      return NextResponse.json({ error: 'Không tìm thấy trạng thái để cập nhật.' }, { status: 404 });
    }
    return NextResponse.json(status);
  } catch (error: any) { 
    console.error('Lỗi khi cập nhật trạng thái:', error);
    if (error.code === 11000) { // Lỗi trùng lặp khóa (nếu question_id là unique)
      return NextResponse.json({ error: 'Trạng thái cho Question ID này đã tồn tại.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Lỗi server khi cập nhật trạng thái.', details: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: Context) {
  try {
    await connectDB();
    const { id } = context.params; 

    const result = await StatusModel.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json({ message: 'Không tìm thấy trạng thái để xóa.' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Đã xóa trạng thái thành công.' });
  } catch (error: any) { 
    console.error('Lỗi khi xóa trạng thái:', error);
    return NextResponse.json({ error: 'Lỗi server khi xóa trạng thái.', details: error.message }, { status: 500 });
  }
}