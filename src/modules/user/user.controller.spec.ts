import { Test, TestingModule } from '@nestjs/testing';
import { UserPasswordService, UserService } from './services';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let userPasswordService: UserPasswordService;
  let mockUserRepository: Partial<Record<keyof UserRepository, jest.Mock>>;

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
});
