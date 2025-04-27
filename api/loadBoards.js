import { connectDB } from './utils/db';
import { User } from './models/User';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).end();

  const { userId } = jwt.verify(token, process.env.JWT_SECRET);

  await connectDB();
  const user = await User.findById(userId);

  res.status(200).json({ boards: user.boards });
}
