import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt , {JwtPayload} from 'jsonwebtoken';
import { generateToken } from '../utils/jwt';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response): Promise<Response> => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = generateToken(user.id.toString());

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict',
    });

    return res.status(201).json({
      message: 'User registered successfully',
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Failed to register user' });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id.toString());

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict',
    });

    return res.status(200).json({
      message: 'Login successful',
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to login' });
  }
};

export const verifyToken = async (req: Request, res: Response): Promise<Response> => {
  const token = req.cookies.token;

  try{
    if(!token){
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as JwtPayload;

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if(!user){
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      message:"Token verified",
      user: { id: user.id, name: user.name, email: user.email },
    })

  }catch(error){
    return res.status(500).json({ error: 'Failed to verify token' });
  }
}

export const logout = async (req: Request, res: Response): Promise<Response> => {
  const { userId } = req.body;

  try {

    // Clear the token cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict',
    });

    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to logout' });
  }
};
