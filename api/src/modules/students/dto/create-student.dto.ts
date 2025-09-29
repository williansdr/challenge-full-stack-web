import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { IsCpfValid } from '../../../shared/decorators';

export class CreateStudentDto {
  @ApiProperty({ example: 'Student Name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'student.email@example.com' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '999.999.999-99' })
  @IsString()
  @IsNotEmpty()
  @IsCpfValid()
  cpf: string;

  @ApiProperty({ example: 'RA2025002' })
  @IsString()
  @IsNotEmpty()
  ra: string;
}
