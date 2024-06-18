import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export default class SignUpDto {
  @ApiProperty({ description: 'Username', required: true })
  username: string;

  @ApiProperty({ description: 'Password', required: true })
  password: string;
}

export const signUpSchema = Joi.object<SignUpDto>({
  username: Joi.string().required(),
  password: Joi.string().required(),
}).options({
  abortEarly: false,
});
