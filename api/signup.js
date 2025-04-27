import { connectDB } from './utils/db';
import { User } from './models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, password } = req.body;
  await connectDB();

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({ email, password: hashedPassword, boards: [] });
  await user.save();

  res.status(201).json({ message: 'User created' });
}
