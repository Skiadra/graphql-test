import { Request } from 'express';

export interface JwtPayload {
  userId: number;
  username: string;
}

export interface AuthRequest extends Request {
  user: JwtPayload;
}

