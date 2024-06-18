import { ApiProperty } from '@nestjs/swagger';

export default class RefreshTokenDto {
  @ApiProperty({ description: 'Device ID' })
  deviceId?: string;
}
