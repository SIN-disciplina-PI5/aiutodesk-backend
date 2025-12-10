import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: jest.Mocked<UsersService>;

  const mockUser: User = {
    id: '7f9c6b2e-3d5b-4a1f-9c2a-0e4d6b1c2f3a',
    name: 'Andrey Kaiky',
    email: 'andrey@example.com',
    role: 'user',
    isActive: true,
  } as User;

  const mockUsersService = {
    findAll: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    changePassword: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get(UsersService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const tenantId = 'tenant-123';
      const mockUsers = [mockUser];
      service.findAll.mockResolvedValue(mockUsers);

      const result = await controller.findAll(tenantId);

      expect(service.findAll).toHaveBeenCalledWith(tenantId, undefined, []);
      expect(result).toEqual(mockUsers);
    });

    it('should return users filtered by role', async () => {
      const tenantId = 'tenant-123';
      const role = 'admin';
      const mockUsers = [mockUser];
      service.findAll.mockResolvedValue(mockUsers);

      const result = await controller.findAll(tenantId, role);

      expect(service.findAll).toHaveBeenCalledWith(tenantId, role, []);
      expect(result).toEqual(mockUsers);
    });

    it('should return users with relations when include is a string', async () => {
      const tenantId = 'tenant-123';
      const include = 'tenant,departments';
      const mockUsers = [mockUser];
      service.findAll.mockResolvedValue(mockUsers);

      const result = await controller.findAll(tenantId, undefined, include);

      expect(service.findAll).toHaveBeenCalledWith(tenantId, undefined, ['tenant', 'departments']);
      expect(result).toEqual(mockUsers);
    });

    it('should return users with relations when include is an array', async () => {
      const tenantId = 'tenant-123';
      const include = ['tenant', 'departments'];
      const mockUsers = [mockUser];
      service.findAll.mockResolvedValue(mockUsers);

      const result = await controller.findAll(tenantId, undefined, include);

      expect(service.findAll).toHaveBeenCalledWith(tenantId, undefined, include);
      expect(result).toEqual(mockUsers);
    });
  });

  describe('findByEmail', () => {
    it('should return a user when email is found', async () => {
      service.findByEmail.mockResolvedValue(mockUser);

      const result = await controller.findByEmail('andrey@example.com');

      expect(service.findByEmail).toHaveBeenCalledWith('andrey@example.com', undefined);
      expect(result).toEqual(mockUser);
    });

    it('should return a user with tenantId filter', async () => {
      const tenantId = 'tenant-123';
      service.findByEmail.mockResolvedValue(mockUser);

      const result = await controller.findByEmail('andrey@example.com', tenantId);

      expect(service.findByEmail).toHaveBeenCalledWith('andrey@example.com', tenantId);
      expect(result).toEqual(mockUser);
    });

    it('should return null when user is not found', async () => {
      service.findByEmail.mockResolvedValue(null);

      const result = await controller.findByEmail('inexistente@example.com');

      expect(service.findByEmail).toHaveBeenCalledWith('inexistente@example.com', undefined);
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return a single user by id', async () => {
      const id = '7f9c6b2e-3d5b-4a1f-9c2a-0e4d6b1c2f3a';
      service.findById.mockResolvedValue(mockUser);

      const result = await controller.findById(id);

      expect(service.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockUser);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createDto: CreateUserDto = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        role: 'user',
        tenantId: 'tenant-123',
      } as CreateUserDto;

      const createdUser = {
        id: mockUser.id,
        name: createDto.name,
        email: createDto.email,
        role: createDto.role,
        isActive: true,
        tenantId: createDto.tenantId,
      };

      service.save.mockResolvedValue(createdUser as any);

      const result = await controller.create(createDto);

      expect(service.save).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(createdUser);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const id = '7f9c6b2e-3d5b-4a1f-9c2a-0e4d6b1c2f3a';
      const updateDto: UpdateUserDto = {
        name: 'Updated Name',
      };
      const updatedUser = { ...mockUser, ...updateDto };

      service.update.mockResolvedValue(updatedUser);

      const result = await controller.update(id, updateDto);

      expect(service.update).toHaveBeenCalledWith(id, updateDto);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('changePassword', () => {
    it('should change user password', async () => {
      const id = '7f9c6b2e-3d5b-4a1f-9c2a-0e4d6b1c2f3a';
      const newPassword = 'newPassword123';

      service.changePassword.mockResolvedValue(mockUser);

      const result = await controller.changePassword(id, newPassword);

      expect(service.changePassword).toHaveBeenCalledWith(id, newPassword);
      expect(result).toEqual(mockUser);
    });

    it('should throw BadRequestException when password is not provided', async () => {
      const id = '7f9c6b2e-3d5b-4a1f-9c2a-0e4d6b1c2f3a';

      await expect(controller.changePassword(id, '')).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.changePassword(id, '')).rejects.toThrow(
        'Senha não informada.',
      );
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const id = '7f9c6b2e-3d5b-4a1f-9c2a-0e4d6b1c2f3a';

      service.remove.mockResolvedValue(undefined);

      const result = await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(id);
      expect(result).toBeUndefined();
    });
  });
});
