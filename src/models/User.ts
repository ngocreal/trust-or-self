import { Schema, model, models } from 'mongoose';
import { User } from '@/features/trust/types';

const UserSchema = new Schema<User>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
}, {
  timestamps: true,
});

const UserModel = models.User || model<User>('User', UserSchema);
export default UserModel;