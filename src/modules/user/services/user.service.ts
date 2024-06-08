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

    const savedUser = await this.userRepository.save(user);

    return this.sanitizeUser(savedUser);
  }

  public async findOne(conditions: FindOneOptions<User>): Promise<User> {
    const user = await this.userRepository.findOne(conditions);
    return this.sanitizeUser(user);
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

    const savedUser = await this.userRepository.save(user);

    return this.sanitizeUser(savedUser);
  }

  public async validateUser(username: string, password: string) {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) throw new UnauthorizedException('Invalid username or password');

    if (await user.validatePassword(password)) {
      return this.sanitizeUser(user);
    }

    return null;
  }

  private sanitizeUser(user: User): User {
    delete user.password;
    return user;
  }
}
