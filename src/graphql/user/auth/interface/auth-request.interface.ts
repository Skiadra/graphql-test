import { Request } from 'express';
import { UserRole } from 'src/enum/user-role.enum';

export interface JwtPayload {
  userId: number;
  username: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user: JwtPayload;
}
