import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response): Promise<Response> => {

  try {

    return res.status(201).json({
        message: 'User registered successfully',
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to register user' });
  }
};