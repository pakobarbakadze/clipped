import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { FindOneOptions, FindOptionsWhere } from 'typeorm';
import { AssignRoleDto } from '../dto/assign-role.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { UserRepository } from '../user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;

    const user = this.userRepository.create({
      username,
      password,
    });

    return this.userRepository.save(user);
  }

  // TODO: change this method to not use repository conditions
  public async findOne(conditions: FindOneOptions<User>): Promise<User> {
    return this.userRepository.findOne(conditions);
  }

  public async update(
    conditions: FindOptionsWhere<User>,
    values: Partial<User>,
  ) {
    return this.userRepository.update(conditions, values);
  }

  public async assignRole(assignRoleDto: AssignRoleDto): Promise<User> {
    const { username, role } = assignRoleDto;

    const user = await this.userRepository.findOne({ where: { username } });

    if (!user)
      throw new NotFoundException(`User with username '${username}' not found`);

    user.role = role;

    return this.userRepository.save(user);
  }

  public async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) throw new UnauthorizedException('Invalid username or password');

    if (await user.validatePassword(password)) {
      return user;
    }

    return null;
  }
}
