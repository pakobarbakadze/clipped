import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthStrategy } from '../types/enum/strategy.enum';

@Injectable()
export default class JwtRefreshTokenGuard extends AuthGuard(
  AuthStrategy.JWT_REFRESH_TOKEN,
) {}
