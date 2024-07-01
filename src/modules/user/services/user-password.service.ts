import { Injectable } from '@nestjs/common';
import { AuthorizedRequest } from 'src/common/types/interface/request.interface';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { ChangeUserPasswordDto } from '../dto/change-user-password.dto';
import { User } from '../entities/user.entity';
import { UserRepository } from '../user.repository';

@Injectable()
export class UserPasswordService {
  constructor(private readonly userRepository: UserRepository) {}

  public async changePassword(
    request: AuthorizedRequest,
    changePasswordDto: ChangePasswordDto,
  ): Promise<User> {
    const { password } = changePasswordDto;

    const user = await this.userRepository.findOne({ id: request.user.id });
    user.password = password;
    await user.hashPass();

    return this.userRepository.save(user);
  }

  public async changeUserPassword(
    changeUserPasswordDto: ChangeUserPasswordDto,
  ): Promise<User> {
    const { username, password } = changeUserPasswordDto;

    const user = await this.userRepository.findOne({ username });
    user.password = password;
    await user.hashPass();

    return this.userRepository.save(user);
  }
}
