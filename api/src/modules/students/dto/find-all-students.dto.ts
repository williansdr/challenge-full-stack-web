import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray, IsEnum, ArrayMaxSize } from 'class-validator';

import { PaginationModel } from '../../../shared/models';
import { SortOrder, StudentSortFields } from '../../../shared/enums';

export class FindAllStudentsDto extends PaginationModel {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cpf?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ra?: string;

  @ApiPropertyOptional({
    description: 'Fields to sort by (comma-separated). Valid values: name, email, cpf, ra',
    type: String,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value
        .split(',')
        .map(field => field.trim())
        .filter(v => v);
    }
    return value;
  })
  @IsArray()
  @ArrayMaxSize(5, { message: 'Maximum 5 sort criteria allowed.' })
  @IsEnum(StudentSortFields, { each: true })
  sortBy?: StudentSortFields[];

  @ApiPropertyOptional({
    description: 'Sort direction for each field (comma-separated). Valid values: asc, desc',
    type: String,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value
        .split(',')
        .map(dir => dir.trim().toLowerCase())
        .filter(v => v);
    }
    return value;
  })
  @IsArray()
  @ArrayMaxSize(5, { message: 'Maximum 5 sort directions allowed.' })
  @IsEnum(SortOrder, { each: true })
  sortDirection?: SortOrder[];
}
