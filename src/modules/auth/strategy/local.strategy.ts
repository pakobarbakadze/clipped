import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserService } from 'src/modules/user/services/user.service';
import { AuthStrategy } from '../types/enum/strategy.enum';

@Injectable()
export class LocalStrategy extends PassportStrategy(
  Strategy,
  AuthStrategy.LOCAL,
) {
  constructor(private readonly userService: UserService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.userService.validateUser(username, password);
    if (!user) throw new UnauthorizedException();

    return user;
  }
}
