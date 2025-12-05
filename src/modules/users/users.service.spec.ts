import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { Tenant } from '@modules/tenants/entities/tenant.entity';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed-pass'),
}));

describe('UsersService', () => {
  let service: UsersService;
  let repo: jest.Mocked<Repository<User>>;
  let tenantRepo: any;

  const mockUser: User = {
    id: '00000000-0000-0000-0000-000000000000',
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
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Tenant),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get(getRepositoryToken(User));
    tenantRepo = module.get(getRepositoryToken(Tenant));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      repo.find.mockResolvedValue([mockUser]);
      const result = await service.findAll('tenant-id');
      expect(result).toEqual([mockUser]);
      expect(repo.find).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a user', async () => {
      repo.findOne.mockResolvedValue(mockUser);
      const result = await service.findOne('id');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne('id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and save a user', async () => {
      tenantRepo.findOne.mockResolvedValue({ id: 'tenant-id' } as any);
      repo.save.mockResolvedValue(mockUser);
      const dto: any = { ...mockUser, tenantId: 'tenant-id' };
      const result = await service.save(dto, 'master');
      const expected = { id: mockUser.id, name: mockUser.name, email: mockUser.email, role: mockUser.role };
      expect(result).toEqual(expected);
      expect(repo.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);
      repo.save.mockResolvedValue({ ...mockUser, name: 'Updated' });
      const result = await service.update('id', { name: 'Updated' } as any);
      expect(result.name).toBe('Updated');
    });
  });

  describe('changePassword', () => {
    it('should change password', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);
      repo.save.mockResolvedValue({ ...mockUser, password: 'newHashed' });
      const result = await service.changePassword('id', 'newPass');
      expect(result.password).toBe('newHashed');
    });
  });

  describe('delete', () => {
    it('should delete user', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);
      repo.remove.mockResolvedValue(undefined as any);
      await expect(service.remove('id')).resolves.toBeUndefined();
    });

    it('should throw NotFoundException when user not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());
      await expect(service.remove('id')).rejects.toThrow(NotFoundException);
    });
  });
});
