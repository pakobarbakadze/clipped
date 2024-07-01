import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { User } from 'src/modules/user/entities/user.entity';
import { UserService } from 'src/modules/user/services/user.service';
import { AuthStrategy } from '../types/enum/strategy.enum';
import { JwtPayload } from '../types/type/jwt-payload.type';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  AuthStrategy.JWT_REFRESH_TOKEN,
) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('REFRESH_JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.userService.findOne({ id: payload.sub });
    if (!user) throw new UnauthorizedException();

    return user;
  }
}
