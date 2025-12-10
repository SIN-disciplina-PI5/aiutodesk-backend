import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: jest.Mocked<AuthService>;

  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
    isActive: true,
  };

  const mockAuthService = {
    signup: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get(AuthService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should signup a user', async () => {
      const signupDto: SignupDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'user',
        tenantId: 'tenant-123',
      } as SignupDto;

      const signupResponse = {
        message: 'User created successfully',
        user: mockUser,
      };

      service.signup.mockResolvedValue(signupResponse);

      const result = await controller.signup(signupDto);

      expect(service.signup).toHaveBeenCalledWith(signupDto);
      expect(result).toEqual(signupResponse);
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const loginResponse = {
        access_token: 'jwt-token',
        user: mockUser,
      };

      service.login.mockResolvedValue(loginResponse);

      const result = await controller.login(loginDto);

      expect(service.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(loginResponse);
      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('user');
    });
  });

  describe('getMe', () => {
    it('should return authenticated user', async () => {
      const mockRequest = {
        user: mockUser,
      };

      const result = await controller.getMe(mockRequest);

      expect(result).toEqual({
        message: 'Authenticated user',
        user: mockUser,
      });
    });
  });

  describe('logout', () => {
    it('should logout successfully', () => {
      const result = controller.logout();

      expect(result).toEqual({
        message: 'Logout performed successfully. Please discard your token.',
      });
    });
  });
});
