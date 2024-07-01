import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AssignRoleDto } from '../dto/assign-role.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { FindOneParam } from '../types/param.types';
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

  public async findOne(findOneParam: FindOneParam): Promise<User> {
    return this.userRepository.findOne(findOneParam);
  }

  public async update(user: User, values: Partial<User>) {
    return this.userRepository.update(user, values);
  }

  public async assignRole(assignRoleDto: AssignRoleDto): Promise<User> {
    const { username, role } = assignRoleDto;

    const user = await this.userRepository.findOne({ username });

    if (!user)
      throw new NotFoundException(`User with username '${username}' not found`);

    user.role = role;

    return this.userRepository.save(user);
  }

  public async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ username });

    if (!user) throw new UnauthorizedException('Invalid username or password');

    if (await user.validatePassword(password)) {
      return user;
    }

    return null;
  }
}
