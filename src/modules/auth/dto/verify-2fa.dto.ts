import { ApiProperty } from '@nestjs/swagger';

export default class VerifyTwoFactorAuthDto {
  @ApiProperty({ description: '2FA token', required: true })
  token: string;
}
