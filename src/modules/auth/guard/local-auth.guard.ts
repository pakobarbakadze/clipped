import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthStrategy } from '../types/enum/strategy.enum';

@Injectable()
export default class LocalAuthGuard extends AuthGuard(AuthStrategy.LOCAL) {}
