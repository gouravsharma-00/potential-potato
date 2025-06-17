import { Request } from 'express';
import jwt from 'jsonwebtoken'
const JWT_SECRET = process.env.JWT_SECRET;

export default function getUserFromToken(req: Request) {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};