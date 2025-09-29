import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@prisma/client';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';

import { SigninDto, SignupDto } from './dto';
import { MeResponseDto } from './dto/me.dto';
import { formatCpf } from '../../shared/utils';
import { UsersRepository } from '../../shared/database/repositories/users.repositories';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto) {
    const { name, email, cpf, password } = signupDto;

    const formattedCpf = formatCpf(cpf);

    const [emailTaken, cpfTaken] = await Promise.all([
      this.usersRepo.findUnique({ where: { email } }),
      this.usersRepo.findUnique({ where: { cpf: formattedCpf } }),
    ]);

    if (emailTaken) {
      throw new ConflictException('This email is already in use.');
    }

    if (cpfTaken) {
      throw new ConflictException('This CPF is already in use.');
    }

    const hashedPassword = password ? await hash(password, 12) : null;

    const user = await this.usersRepo.create({
      data: { name, email, cpf: formattedCpf, password: hashedPassword, role: UserRole.ADMIN },
    });

    return user;
  }

  async signin(signinDto: SigninDto) {
    const { email, password } = signinDto;

    const user = await this.usersRepo.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        ra: true,
        password: true,
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const accessToken = await this.generateAccessToken(
      user.id,
      user.name,
      user.email,
      user.cpf,
      user.ra,
      user.role,
    );

    return { accessToken };
  }

  async me(userId: string): Promise<MeResponseDto> {
    const user = await this.usersRepo.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        ra: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private generateAccessToken(
    userId: string,
    name: string,
    email: string,
    cpf: string,
    ra: string | null,
    role: UserRole,
  ) {
    return this.jwtService.signAsync({
      sub: userId,
      name,
      email,
      cpf,
      ra,
      role,
    });
  }
}
