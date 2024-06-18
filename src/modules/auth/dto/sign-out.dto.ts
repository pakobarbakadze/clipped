import { ApiProperty } from '@nestjs/swagger';

export default class {
  @ApiProperty({ description: 'Device ID' })
  deviceId: string;
}
