import { Test, TestingModule } from '@nestjs/testing';
import { UserRole } from '@prisma/client';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignupDto, SigninDto } from './dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    signup: jest.fn(),
    signin: jest.fn(),
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
    service = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    const signupDto: SignupDto = {
      name: 'Test User',
      email: 'test@example.com',
      cpf: '123.456.789-00',
      password: 'Test@1234',
    };

    const expectedUser = {
      id: 'user-id-123',
      name: 'Test User',
      email: 'test@example.com',
      cpf: '123.456.789-00',
      role: UserRole.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should create a new user successfully', async () => {
      mockAuthService.signup.mockResolvedValue(expectedUser);

      const result = await controller.signup(signupDto);

      expect(result).toEqual(expectedUser);
      expect(mockAuthService.signup).toHaveBeenCalledWith(signupDto);
      expect(mockAuthService.signup).toHaveBeenCalledTimes(1);
    });

    it('should handle validation errors', async () => {
      const invalidDto = {
        ...signupDto,
        email: 'invalid-email',
      };
      const validationError = new Error('Validation failed');
      mockAuthService.signup.mockRejectedValue(validationError);

      await expect(controller.signup(invalidDto)).rejects.toThrow(validationError);
    });
  });

  describe('signin', () => {
    const signinDto: SigninDto = {
      email: 'test@example.com',
      password: 'Test@1234',
    };

    const expectedResponse = {
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    };

    it('should sign in successfully and return access token', async () => {
      mockAuthService.signin.mockResolvedValue(expectedResponse);

      const result = await controller.signin(signinDto);

      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.signin).toHaveBeenCalledWith(signinDto);
      expect(mockAuthService.signin).toHaveBeenCalledTimes(1);
    });

    it('should handle missing password', async () => {
      const incompleteDto = {
        email: 'test@example.com',
      } as SigninDto;
      const error = new Error('Password is required');
      mockAuthService.signin.mockRejectedValue(error);

      await expect(controller.signin(incompleteDto)).rejects.toThrow(error);
    });
  });
});
