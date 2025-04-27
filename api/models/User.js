import mongoose from 'mongoose';

const BoardSchema = new mongoose.Schema({
  id: Number,
  type: String,
  title: String,
  items: Array,
  subBoards: Array
}, { _id: false });

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  boards: [BoardSchema]
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
