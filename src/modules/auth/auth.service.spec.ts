import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { BcryptService } from '../../core/bcrypt.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let bcryptService: jest.Mocked<BcryptService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: 'user',
    isActive: true,
    tenant: {
      id: 'tenant-123',
      name: 'Test Tenant',
    },
  };

  const mockUsersService = {
    findByEmail: jest.fn(),
    findByEmailWithPassword: jest.fn(),
    createForAuth: jest.fn(),
    safeUser: jest.fn(),
  };

  const mockBcryptService = {
    compare: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: BcryptService,
          useValue: mockBcryptService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    bcryptService = module.get(BcryptService);
    jwtService = module.get(JwtService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('should signup a user successfully', async () => {
      const signupDto: SignupDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'user',
        tenantId: 'tenant-123',
      } as SignupDto;

      const safeUser = {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
        isActive: mockUser.isActive,
      };

      usersService.findByEmail.mockResolvedValue(null);
      usersService.createForAuth.mockResolvedValue(mockUser as any);
      usersService.safeUser.mockReturnValue(safeUser);

      const result = await service.signup(signupDto);

      expect(usersService.findByEmail).toHaveBeenCalledWith(signupDto.email);
      expect(usersService.createForAuth).toHaveBeenCalledWith(
        expect.objectContaining({
          name: signupDto.name,
          email: signupDto.email,
          tenantId: signupDto.tenantId,
        }),
      );
      expect(result).toEqual({
        message: 'User created successfully',
        user: safeUser,
      });
    });

    it('should throw ConflictException when email already exists', async () => {
      const signupDto: SignupDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'user',
        tenantId: 'tenant-123',
      } as SignupDto;

      usersService.findByEmail.mockResolvedValue(mockUser as any);

      await expect(service.signup(signupDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.signup(signupDto)).rejects.toThrow(
        'Email already registered',
      );
      expect(usersService.createForAuth).not.toHaveBeenCalled();
    });
  });

  describe('validateUser', () => {
    it('should validate user successfully', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      usersService.findByEmailWithPassword.mockResolvedValue(mockUser as any);
      bcryptService.compare.mockResolvedValue(true);

      const result = await service.validateUser(email, password);

      expect(usersService.findByEmailWithPassword).toHaveBeenCalledWith(email);
      expect(bcryptService.compare).toHaveBeenCalledWith(
        password,
        mockUser.password,
      );
      expect(result).toEqual(mockUser);
    });

    it('should return null when user is not found', async () => {
      const email = 'nonexistent@example.com';
      const password = 'password123';

      usersService.findByEmailWithPassword.mockResolvedValue(null);

      const result = await service.validateUser(email, password);

      expect(result).toBeNull();
      expect(bcryptService.compare).not.toHaveBeenCalled();
    });

    it('should return null when password is invalid', async () => {
      const email = 'test@example.com';
      const password = 'wrongPassword';

      usersService.findByEmailWithPassword.mockResolvedValue(mockUser as any);
      bcryptService.compare.mockResolvedValue(false);

      const result = await service.validateUser(email, password);

      expect(bcryptService.compare).toHaveBeenCalledWith(
        password,
        mockUser.password,
      );
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should login a user successfully', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const safeUser = {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
        isActive: mockUser.isActive,
      };

      const token = 'jwt-token';

      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser as any);
      usersService.safeUser.mockReturnValue(safeUser);
      jwtService.signAsync.mockResolvedValue(token);

      const result = await service.login(loginDto);

      expect(service.validateUser).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        tenantId: mockUser.tenant.id,
        email: mockUser.email,
      });
      expect(result).toEqual({
        access_token: token,
        user: safeUser,
      });
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongPassword',
      };

      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        'Invalid email or password',
      );
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });
  });
});
