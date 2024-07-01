import { Test, TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { UserDto } from '../../common/dto/user.dto';
import { Role } from '../../common/types/enum/role.enum';
import { AssignRoleDto } from './dto/assign-role.dto';
import { User } from './entities/user.entity';
import { UserPasswordService, UserService } from './services';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let userPasswordService: UserPasswordService;
  let mockUserRepository: Partial<Record<keyof UserRepository, jest.Mock>>;

  const mockUser = {
    id: '1',
    username: 'testUser',
    password: 'testPassword',
    role: Role.User,
    twoFactorSecret: 'testSecret',
  } as User;

  beforeEach(async () => {
    mockUserRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        UserPasswordService,
        { provide: UserRepository, useValue: mockUserRepository },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    userPasswordService = module.get<UserPasswordService>(UserPasswordService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const { username } = mockUser;

      jest.spyOn(userService, 'findOne').mockResolvedValue(mockUser);

      const result = await userController.findOne(username);

      expect(userService.findOne).toHaveBeenCalledWith({ username });

      const userDto = plainToClass(UserDto, mockUser, {
        excludeExtraneousValues: true,
      });

      expect(result).toEqual(userDto);
    });
  });

  describe('assignRole', () => {
    it('should assign a role to a user', async () => {
      const assignRoleDto: AssignRoleDto = {
        username: 'testuser',
        role: Role.Admin,
      };
      mockUser.role = Role.Admin;

      jest.spyOn(userService, 'assignRole').mockResolvedValue(mockUser);

      const result = await userController.assignRole(assignRoleDto);

      expect(userService.assignRole).toHaveBeenCalledWith(assignRoleDto);

      const userDto = plainToClass(UserDto, mockUser, {
        excludeExtraneousValues: true,
      });

      expect(result).toEqual(userDto);
    });
  });
});
