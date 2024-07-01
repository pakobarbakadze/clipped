import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { FindOneParam } from './types/param.types';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public create(user: Partial<User>): User {
    return this.userRepository.create(user);
  }

  public save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  public findOne(findOneParam: FindOneParam): Promise<User> {
    const { id, username } = findOneParam;
    const whereCondition = id ? { id } : username ? { username } : {};
    return this.userRepository.findOne({ where: whereCondition });
  }

  public update(user: User, values: Partial<User>) {
    return this.userRepository.update({ id: user.id }, values);
  }
}
