import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export default class SignInDto {
  @ApiProperty({ description: 'Username', required: true })
  username: string;

  @ApiProperty({ description: 'Password', required: true })
  password: string;

  @ApiProperty({ description: 'Device ID' })
  deviceId: string;
}

export const signInSchema = Joi.object<SignInDto>({
  username: Joi.string().required(),
  password: Joi.string().required(),
  deviceId: Joi.string(),
}).options({
  abortEarly: false,
});
