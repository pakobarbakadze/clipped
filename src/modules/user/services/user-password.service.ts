import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorizedRequest } from 'src/common/types/interface/request.interface';
import { Repository } from 'typeorm';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { ChangeUserPasswordDto } from '../dto/change-user-password.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UserPasswordService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public async changePassword(
    request: AuthorizedRequest,
    changePasswordDto: ChangePasswordDto,
  ): Promise<User> {
    const { password } = changePasswordDto;

    const user = await this.userRepository.findOne({
      where: { id: request.user.id },
    });
    user.password = password;
    await user.hashPass();

    const savedUser = await this.userRepository.save(user);
    delete savedUser.password;

    return savedUser;
  }

  public async changeUserPassword(
    changeUserPasswordDto: ChangeUserPasswordDto,
  ): Promise<User> {
    const { username, password } = changeUserPasswordDto;

    const user = await this.userRepository.findOne({
      where: { username },
    });
    user.password = password;
    await user.hashPass();

    delete user.password;

    return this.userRepository.save(user);
  }
}
