import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { SigninDto, SignupDto } from './dto';
import { MeResponseDto } from './dto/me.dto';
import { AuthService } from './auth.service';
import { IsPublic } from '../../shared/decorators';
import { SignupResponses, SigninResponses, MeResponses } from '../../shared/swagger-docs';

@Controller('auth')
@ApiTags('Auth - Authentication endpoints')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @Post('signup')
  @ApiOperation({ summary: 'Register a new admin user' })
  @ApiResponse(SignupResponses['201'])
  @ApiResponse(SignupResponses['400'])
  @ApiResponse(SignupResponses['409'])
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @IsPublic()
  @Post('signin')
  @ApiOperation({ summary: 'Authenticate user and get access token' })
  @ApiResponse(SigninResponses['200'])
  @ApiResponse(SigninResponses['400'])
  @ApiResponse(SigninResponses['401'])
  signin(@Body() signinDto: SigninDto) {
    return this.authService.signin(signinDto);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user information' })
  @ApiResponse(MeResponses['200'])
  @ApiResponse(MeResponses['401'])
  me(@Req() request: any): Promise<MeResponseDto> {
    return this.authService.me(request.userId);
  }
}
