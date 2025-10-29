import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repo: jest.Mocked<Repository<User>>;

  const mockUser: User = {
    id: 1,
    name: "Andrey",
    email: "andrey@example.com",
    password: "1234Teste",
    role: "admin",
  } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      repo.find.mockResolvedValue([mockUser]);
      const result = await service.findAll();
      expect(result).toEqual([mockUser]);
      expect(repo.find).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a user', async () => {
      repo.findOne.mockResolvedValue(mockUser);
      const result = await service.findById(1);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and save a user', async () => {
      repo.create.mockReturnValue(mockUser);
      repo.save.mockResolvedValue(mockUser);
      const result = await service.create(mockUser);
      expect(result).toEqual(mockUser);
      expect(repo.create).toHaveBeenCalledWith(mockUser);
      expect(repo.save).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(mockUser);
      repo.save.mockResolvedValue({ ...mockUser, name: 'Updated' });
      const result = await service.update(1, { name: 'Updated' });
      expect(result.name).toBe('Updated');
    });
  });

  describe('changePassword', () => {
    it('should change password', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(mockUser);
      repo.save.mockResolvedValue({ ...mockUser, password: 'newPass' });
      const result = await service.changePassword(1, 'newPass');
      expect(result.password).toBe('newPass');
    });
  });

  describe('delete', () => {
    it('should delete user', async () => {
      repo.delete.mockResolvedValue({ affected: 1 } as any);
      await expect(service.delete(1)).resolves.toBeUndefined();
    });

    it('should throw NotFoundException when user not found', async () => {
      repo.delete.mockResolvedValue({ affected: 0 } as any);
      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
    });
  });
});
