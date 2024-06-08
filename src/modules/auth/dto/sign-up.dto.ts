import * as Joi from 'joi';

export class SignUpDto {
  username: string;
  password: string;
  companyName: string;
}

export const signUpSchema = Joi.object<SignUpDto>({
  username: Joi.string().required(),
  password: Joi.string().required(),
  companyName: Joi.string().required(),
}).options({
  abortEarly: false,
});
