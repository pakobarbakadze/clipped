import { BadRequestException, PipeTransform } from '@nestjs/common';
import SignInDto, { signInSchema } from '../dto/sign-in.dto';

export default class SignInValidationPipe implements PipeTransform<SignInDto> {
  public transform(value: SignInDto): SignInDto {
    const result = signInSchema.validate(value);
    if (result.error) {
      const errorMessages = result.error.details.map((d) => d.message).join();
      throw new BadRequestException(errorMessages);
    }
    return value;
  }
}
