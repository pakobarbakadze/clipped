import { BadRequestException, PipeTransform } from '@nestjs/common';
import { SignUpDto, signUpSchema } from '../dto/sign-up.dto';

export class SignUpValidatorPipe implements PipeTransform<SignUpDto> {
  public transform(value: SignUpDto): SignUpDto {
    const result = signUpSchema.validate(value);
    if (result.error) {
      const errorMessages = result.error.details.map((d) => d.message).join();
      throw new BadRequestException(errorMessages);
    }
    return value;
  }
}
