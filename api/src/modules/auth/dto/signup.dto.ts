import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

import { IsCpfValid } from '../../../shared/decorators';

export class SignupDto {
  @ApiProperty({ example: 'Admin Name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'admin.email@example.com' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '999.999.999-99' })
  @IsString()
  @IsNotEmpty()
  @IsCpfValid()
  cpf: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
