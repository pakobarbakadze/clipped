import { ApiProperty } from '@nestjs/swagger';

export class ChangeUserPasswordDto {
  @ApiProperty({ description: 'Username', required: true })
  username: string;

  @ApiProperty({ description: 'New password', required: true })
  password: string;
}
