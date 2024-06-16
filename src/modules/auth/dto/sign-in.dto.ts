import * as Joi from 'joi';

export default class SignInDto {
  username: string;
  password: string;
  deviceId: string;
}

export const signInSchema = Joi.object<SignInDto>({
  username: Joi.string().required(),
  password: Joi.string().required(),
  deviceId: Joi.string(),
}).options({
  abortEarly: false,
});
