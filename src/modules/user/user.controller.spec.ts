import { Test, TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { UserDto } from '../../common/dto/user.dto';
import { Role } from '../../common/types/enum/role.enum';
import { AuthorizedRequest } from '../../common/types/interface/request.interface';
import { AssignRoleDto } from './dto/assign-role.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangeUserPasswordDto } from './dto/change-user-password.dto';
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
    role: Role.User,
    createdAt: new Date(),
    updatedAt: new Date(),
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

  describe('changePassword', () => {
    it('should change the password for a user', async () => {
      const mockRequest = {
        user: mockUser,
      } as AuthorizedRequest;

      const mockChangePasswordDto: ChangePasswordDto = {
        password: 'newPassword',
      };

      jest
        .spyOn(userPasswordService, 'changePassword')
        .mockResolvedValue(mockUser);

      const result = await userController.changePassword(
        mockRequest,
        mockChangePasswordDto,
      );

      expect(userPasswordService.changePassword).toHaveBeenCalledWith(
        mockRequest,
        mockChangePasswordDto,
      );

      const userDto = plainToClass(UserDto, mockUser, {
        excludeExtraneousValues: true,
      });

      expect(result).toEqual(userDto);
    });
  });

  describe('changeUserPassword', () => {
    it('should change the password of a user', async () => {
      const mockChangeUserPasswordDto: ChangeUserPasswordDto = {
        username: 'testUser',
        password: 'newPassword',
      };

      jest
        .spyOn(userPasswordService, 'changeUserPassword')
        .mockResolvedValue(mockUser);

      const result = await userController.changeUserPassword(
        mockChangeUserPasswordDto,
      );

      expect(userPasswordService.changeUserPassword).toHaveBeenCalledWith(
        mockChangeUserPasswordDto,
      );

      const userDto = plainToClass(UserDto, mockUser, {
        excludeExtraneousValues: true,
      });

      expect(result).toEqual(userDto);
    });
  });
});
