import { Schema, model, models } from 'mongoose';
import { Status } from '@/features/trust/types';

const StatusSchema = new Schema<Status>({
  question_id: { type: String, required: true, unique: true },
  count_a: { type: Number, default: 0 },
  count_b: { type: Number, default: 0 },
}, {
  timestamps: true,
});

const StatusModel = models.Status || model<Status>('Status', StatusSchema);
export default StatusModel;