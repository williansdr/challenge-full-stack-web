import { UserRole } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';

import { RolesGuard } from '../auth/roles.guard';
import { StudentsService } from './students.service';
import { Roles } from '../../shared/decorators/Roles';
import { CreateStudentDto, FindAllStudentsDto, UpdateStudentDto } from './dto';
import {
  CreateStudentResponses,
  FindAllStudentsResponses,
  FindOneStudentResponses,
  UpdateStudentResponses,
  DeleteStudentResponses,
} from '../../shared/swagger-docs';

@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('students')
@ApiTags('Students - Students management endpoints')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new student' })
  @ApiResponse(CreateStudentResponses['201'])
  @ApiResponse(CreateStudentResponses['400'])
  @ApiResponse(CreateStudentResponses['401'])
  @ApiResponse(CreateStudentResponses['403'])
  @ApiResponse(CreateStudentResponses['409'])
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.createStudent(createStudentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active students' })
  @ApiResponse(FindAllStudentsResponses['200'])
  @ApiResponse(FindAllStudentsResponses['401'])
  @ApiResponse(FindAllStudentsResponses['403'])
  findAll(@Query() query: FindAllStudentsDto) {
    return this.studentsService.findAllStudents(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get student by ID' })
  @ApiResponse(FindOneStudentResponses['200'])
  @ApiResponse(FindOneStudentResponses['401'])
  @ApiResponse(FindOneStudentResponses['403'])
  @ApiResponse(FindOneStudentResponses['404'])
  findOne(@Param('id') id: string) {
    return this.studentsService.findStudentById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update student (only name and email are editable)' })
  @ApiResponse(UpdateStudentResponses['200'])
  @ApiResponse(UpdateStudentResponses['400'])
  @ApiResponse(UpdateStudentResponses['401'])
  @ApiResponse(UpdateStudentResponses['403'])
  @ApiResponse(UpdateStudentResponses['404'])
  @ApiResponse(UpdateStudentResponses['409'])
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.updateStudent(id, updateStudentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete student' })
  @ApiResponse(DeleteStudentResponses['200'])
  @ApiResponse(DeleteStudentResponses['401'])
  @ApiResponse(DeleteStudentResponses['403'])
  @ApiResponse(DeleteStudentResponses['404'])
  remove(@Param('id') id: string) {
    return this.studentsService.deleteStudent(id);
  }
}
