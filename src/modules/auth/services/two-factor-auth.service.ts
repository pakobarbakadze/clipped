import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as qrcode from 'qrcode';
import * as speakeasy from 'speakeasy';
import { UserService } from 'src/modules/user/services/user.service';
import { User } from '../../user/entities/user.entity';
import { VerifyTwoFactorAuthDto } from '../dto';

export class TwoFactorAuthService {
  constructor(private readonly userService: UserService) {}

  public async enableTwoFactorAuth(user: User): Promise<{ qrCodeUrl: string }> {
    const secret = speakeasy.generateSecret({ length: 20 }).base32;

    await this.userService.update({ id: user.id }, { twoFactorSecret: secret });

    const qrCodeUrl = await qrcode.toDataURL(
      `otpauth://totp/${user.username}?secret=${secret}&issuer=CMS`,
    );

    return { qrCodeUrl };
  }

  public async verifyTwoFactorAuth(
    user: User,
    verifyTwoFactorAuthDto: VerifyTwoFactorAuthDto,
  ): Promise<{ isValid: boolean }> {
    const { token } = verifyTwoFactorAuthDto;

    const { twoFactorSecret } =
      (await this.userService.findOne({
        where: { id: user.id },
        select: ['twoFactorSecret'],
      })) || {};

    if (!twoFactorSecret)
      throw new NotFoundException('2FA is not enabled for this user');

    const isValid = speakeasy.totp.verify({
      secret: twoFactorSecret,
      encoding: 'base32',
      token,
    });

    if (!isValid)
      throw new UnauthorizedException('Invalid two-factor authentication code');

    return { isValid };
  }

  public async disableTwoFactorAuth(user: User): Promise<{ message: string }> {
    await this.userService.update({ id: user.id }, { twoFactorSecret: null });

    return { message: 'Two-factor authentication disabled successfully' };
  }
}
