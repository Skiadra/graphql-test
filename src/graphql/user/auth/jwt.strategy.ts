import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user.service';
import { JwtPayload } from './interface/auth-request.interface';
import { ConfigService } from '@nestjs/config';
import { UserRole } from 'src/enum/user-role.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<{
    userId: number;
    username: string;
    role: UserRole;
  }> {
    const user = await this.userService.findOne(payload.userId);
    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      userId: payload.userId,
      username: payload.username,
      role: payload.role,
    };
  }
}
