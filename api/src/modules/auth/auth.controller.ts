import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { SigninDto, SignupDto } from './dto';
import { AuthService } from './auth.service';
import { IsPublic } from '../../shared/decorators';
import { SignupResponses, SigninResponses } from '../../shared/swagger-docs';

@IsPublic()
@Controller('auth')
@ApiTags('Auth - Authentication endpoints')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new admin user' })
  @ApiResponse(SignupResponses['201'])
  @ApiResponse(SignupResponses['400'])
  @ApiResponse(SignupResponses['409'])
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Authenticate user and get access token' })
  @ApiResponse(SigninResponses['200'])
  @ApiResponse(SigninResponses['400'])
  @ApiResponse(SigninResponses['401'])
  signin(@Body() signinDto: SigninDto) {
    return this.authService.signin(signinDto);
  }
}
