import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InsertRefreshTokenDto } from '../dto';
import { RefreshToken } from '../entities/refresh-token.entity';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  public async insert(
    insertRefreshTokenDto: InsertRefreshTokenDto,
  ): Promise<void> {
    try {
      const { user, deviceId, token } = insertRefreshTokenDto;

      let refreshToken = await this.refreshTokenRepository.findOne({
        where: { deviceId },
      });

      if (!refreshToken) {
        refreshToken = this.refreshTokenRepository.create({
          user,
          deviceId,
          refreshToken: token,
        });
      } else {
        refreshToken.refreshToken = token;
      }

      await this.refreshTokenRepository.save(refreshToken);
    } catch (error) {
      throw new HttpException('Error while inserting Refresh Token', 500);
    }
  }

  public async validate(userId: string, deviceId: string): Promise<boolean> {
    try {
      const refreshToken = await this.refreshTokenRepository.findOne({
        where: { user: { id: userId }, deviceId },
      });
      if (!refreshToken) {
        throw new Error('Invalidated Refresh Token');
      }
      return true;
    } catch (error) {
      throw new HttpException('Error while validating Refresh Token', 500);
    }
  }

  public async invalidate(userId: string, deviceId: string): Promise<void> {
    try {
      await this.refreshTokenRepository.delete({
        user: { id: userId },
        deviceId,
      });
    } catch (error) {
      throw new HttpException('Error while invalidating Refresh Token', 500);
    }
  }
}
