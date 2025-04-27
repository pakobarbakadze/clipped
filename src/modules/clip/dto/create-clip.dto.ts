import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClipDto {
  @ApiProperty({
    description: 'The title of the clip',
    example: 'My awesome gaming moment',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  title: string;
}
