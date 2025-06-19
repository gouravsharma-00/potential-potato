// src/auth.ts
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'YOUR_SUPER_SECRET_KEY'; 

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: '1h' });
};

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { userId: string };
    return decoded.userId;
  } catch (error) {
    return null;
  }
};