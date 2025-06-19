// src/context.ts
import { PrismaClient } from '@prisma/client';
import { Request } from 'express';
import { prisma } from './prisma';
import { verifyToken } from './auth';

interface AuthPayload {
  userId: string;
}

export interface Context {
  prisma: PrismaClient;
  userId: string | null;
}

export const createContext = ({ req }: { req: Request }): Context => {
  const token = req.headers.authorization?.split(' ')[1];
  const userId = token ? verifyToken(token) : null;
  return {
    prisma,
    userId,
  };
};