import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthStrategy } from '../types/enum/strategy.enum';

@Injectable()
export default class JwtAuthGuard extends AuthGuard(AuthStrategy.JWT) {}
