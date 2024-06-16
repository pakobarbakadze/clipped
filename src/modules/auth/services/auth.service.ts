import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/user/services/user.service';
import { User } from '../../user/entities/user.entity';
import { RefreshTokenDto, SignUpDto } from '../dto';
import { JwtPayload } from '../types/type/jwt-payload.type';
import { Payload } from '../types/type/payload.type';
import { RefreshTokenService } from './refresh-token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly configSercive: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  public async signIn(
    user: User,
    deviceId: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload: JwtPayload = { sub: user.id, username: user.username };

    const [accessToken, refreshToken] = await this.signTokens(payload);

    await this.refreshTokenService.insert({
      user,
      deviceId,
      token: refreshToken,
    });

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  public async signUp(signUpDto: SignUpDto): Promise<User> {
    const { username, password } = signUpDto;

    const createdUser = await this.userService.create({
      username,
      password,
    });

    return createdUser;
  }

  public async refreshAccessToken(
    authorization: string,
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ access_token: string }> {
    const { deviceId } = refreshTokenDto;
    const refreshToken = authorization.split(' ')[1];
    const decoded = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.configSercive.get<string>('REFRESH_JWT_SECRET'),
    });
    await this.refreshTokenService.validate(decoded.sub, deviceId);
    const payload = { sub: decoded.sub, username: decoded.username };
    const accessToken = await this.jwtService.signAsync(payload);

    return { access_token: accessToken };
  }

  public async invalidateToken(
    authorization: string,
    deviceId: string,
  ): Promise<{ message: string }> {
    const token = authorization.split(' ')[1];
    const decoded = await this.jwtService.verifyAsync(token);
    await this.refreshTokenService.invalidate(decoded.sub, deviceId);

    return { message: 'Token invalidated successfully' };
  }

  private signTokens(payload: Payload) {
    return Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.configSercive.get<string>('REFRESH_JWT_SECRET'),
        expiresIn: '1w',
      }),
    ]);
  }
}
