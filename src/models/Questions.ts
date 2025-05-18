import { Schema, model, models } from 'mongoose';
import { Question } from '@/features/trust/types';

const QuestionsSchema = new Schema<Question>({
  _id: { type: String, required: true },
  content: { type: String, required: true },
});

const QuestionsModel = models.Questions || model<Question>('Questions', QuestionsSchema);
export default QuestionsModel;