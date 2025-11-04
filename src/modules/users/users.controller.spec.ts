import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('deve retornar um usuário quando o email for encontrado', async () => {
    const mockUser: User = {
      id: '7f9c6b2e-3d5b-4a1f-9c2a-0e4d6b1c2f3a',
      name: 'Andrey Kaiky',
      email: 'andrey@example.com',
    } as User;

    jest.spyOn(service, 'findByEmail').mockResolvedValue(mockUser);

    const result = await controller.findByEmail('andrey@example.com');

    expect(service.findByEmail).toHaveBeenCalledWith('andrey@example.com', undefined);
    expect(result).toEqual(mockUser);
  });

  it('deve retornar null quando o usuário não for encontrado', async () => {
    jest.spyOn(service, 'findByEmail').mockResolvedValue(null);

    const result = await controller.findByEmail('inexistente@example.com');

    expect(service.findByEmail).toHaveBeenCalledWith('inexistente@example.com', undefined);
    expect(result).toBeNull();
  });
});
