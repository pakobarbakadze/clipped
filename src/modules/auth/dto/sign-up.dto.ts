import * as Joi from 'joi';

export default class SignUpDto {
  username: string;
  password: string;
}

export const signUpSchema = Joi.object<SignUpDto>({
  username: Joi.string().required(),
  password: Joi.string().required(),
}).options({
  abortEarly: false,
});
