import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateStudentDto {
  @ApiProperty({ example: 'Student Name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'student.email@example.com' })
  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;
}
