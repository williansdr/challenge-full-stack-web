import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

import { AuthService } from './auth.service';
import { SignupDto, SigninDto } from './dto';
import { UsersRepository } from '../../shared/database/repositories/users.repositories';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersRepository: UsersRepository;
  let jwtService: JwtService;

  const mockUsersRepository = {
    findUnique: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  describe('signup', () => {
    const signupDto: SignupDto = {
      name: 'Test User',
      email: 'test@example.com',
      cpf: '123.456.789-00',
      password: 'Test@1234',
    };

    const mockUser = {
      id: 'user-id-123',
      name: 'Test User',
      email: 'test@example.com',
      cpf: '123.456.789-00',
      password: 'hashed-password',
      role: UserRole.ADMIN,
      ra: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    it('should create a new user successfully', async () => {
      mockUsersRepository.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      mockUsersRepository.create.mockResolvedValue(mockUser);

      const result = await service.signup(signupDto);

      expect(result).toEqual(mockUser);
      expect(mockUsersRepository.findUnique).toHaveBeenCalledTimes(2);
      expect(mockUsersRepository.findUnique).toHaveBeenCalledWith({
        where: { email: signupDto.email },
      });
      expect(mockUsersRepository.findUnique).toHaveBeenCalledWith({
        where: { cpf: signupDto.cpf },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(signupDto.password, 12);
      expect(mockUsersRepository.create).toHaveBeenCalledWith({
        data: {
          name: signupDto.name,
          email: signupDto.email,
          cpf: signupDto.cpf,
          password: 'hashed-password',
          role: UserRole.ADMIN,
        },
      });
    });

    it('should format CPF before checking and saving', async () => {
      const unformattedCpfDto = {
        ...signupDto,
        cpf: '12345678900',
      };
      mockUsersRepository.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      mockUsersRepository.create.mockResolvedValue(mockUser);

      await service.signup(unformattedCpfDto);

      expect(mockUsersRepository.findUnique).toHaveBeenCalledWith({
        where: { cpf: '123.456.789-00' },
      });
      expect(mockUsersRepository.create).toHaveBeenCalledWith({
        data: {
          name: signupDto.name,
          email: signupDto.email,
          cpf: '123.456.789-00',
          password: 'hashed-password',
          role: UserRole.ADMIN,
        },
      });
    });

    it('should throw ConflictException when email is already in use', async () => {
      mockUsersRepository.findUnique.mockResolvedValueOnce(mockUser).mockResolvedValueOnce(null);

      await expect(service.signup(signupDto)).rejects.toThrow(
        new ConflictException('This email is already in use.'),
      );
      expect(mockUsersRepository.create).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when CPF is already in use', async () => {
      mockUsersRepository.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce(mockUser);

      await expect(service.signup(signupDto)).rejects.toThrow(
        new ConflictException('This CPF is already in use.'),
      );
      expect(mockUsersRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('signin', () => {
    const signinDto: SigninDto = {
      email: 'test@example.com',
      password: 'Test@1234',
    };

    const mockUser = {
      id: 'user-id-123',
      email: 'test@example.com',
      password: 'hashed-password',
      role: UserRole.ADMIN,
    };

    it('should sign in successfully and return access token', async () => {
      mockUsersRepository.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('access-token-123');

      const result = await service.signin(signinDto);

      expect(result).toEqual({ accessToken: 'access-token-123' });
      expect(mockUsersRepository.findUnique).toHaveBeenCalledWith({
        where: { email: signinDto.email },
        select: {
          id: true,
          email: true,
          password: true,
          role: true,
        },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(signinDto.password, mockUser.password);
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        role: mockUser.role,
      });
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockUsersRepository.findUnique.mockResolvedValue(null);

      await expect(service.signin(signinDto)).rejects.toThrow(
        new UnauthorizedException('Invalid Credentials'),
      );
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(mockJwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      mockUsersRepository.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.signin(signinDto)).rejects.toThrow(
        new UnauthorizedException('Invalid Credentials'),
      );
      expect(mockJwtService.signAsync).not.toHaveBeenCalled();
    });
  });
});
