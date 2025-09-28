import { UserRole, Prisma } from '@prisma/client';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { formatCpf } from '../../shared/utils';
import { CreateStudentDto, UpdateStudentDto, FindAllStudentsDto } from './dto';
import { UsersRepository } from '../../shared/database/repositories/users.repositories';
import { PaginationMeta } from '../../shared/interfaces/api-response.interface';
import { SortOrder, StudentSortFields } from '../../shared/enums';

@Injectable()
export class StudentsService {
  constructor(private readonly usersRepo: UsersRepository) {}

  async createStudent(createStudentDto: CreateStudentDto) {
    const { name, email, ra, cpf } = createStudentDto;

    const formattedCpf = formatCpf(cpf);

    const [emailTaken, cpfTaken, raTaken] = await Promise.all([
      this.usersRepo.findUnique({ where: { email } }),
      this.usersRepo.findUnique({ where: { cpf: formattedCpf } }),
      ra ? this.usersRepo.findUnique({ where: { ra } }) : null,
    ]);

    if (emailTaken) {
      throw new ConflictException('This email is already in use.');
    }

    if (cpfTaken) {
      throw new ConflictException('This CPF is already in use.');
    }

    if (raTaken) {
      throw new ConflictException('This RA is already in use.');
    }

    const student = await this.usersRepo.create({
      data: { name, email, ra, cpf: formattedCpf, role: UserRole.STUDENT },
      select: {
        id: true,
        name: true,
        email: true,
        ra: true,
        cpf: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return student;
  }

  async findAllStudents(filters?: FindAllStudentsDto) {
    const page = Number(filters?.page) || 1;
    const pageSize = Number(filters?.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    const orConditions = [
      filters?.name && { name: { contains: filters.name, mode: 'insensitive' as const } },
      filters?.email && { email: { contains: filters.email, mode: 'insensitive' as const } },
      filters?.cpf && { cpf: formatCpf(filters.cpf) },
      filters?.ra && { ra: filters.ra },
    ].filter(Boolean);

    let sortBy: StudentSortFields[] = [];
    if (filters?.sortBy) {
      if (typeof filters.sortBy === 'string') {
        sortBy = (filters.sortBy as string)
          .split(',')
          .map(field => field.trim()) as StudentSortFields[];
      } else if (Array.isArray(filters.sortBy)) {
        sortBy = filters.sortBy;
      }
    }

    let sortDirection: SortOrder[] = [];
    if (filters?.sortDirection) {
      if (typeof filters.sortDirection === 'string') {
        sortDirection = (filters.sortDirection as string)
          .split(',')
          .map(dir => dir.trim().toLowerCase()) as SortOrder[];
      } else if (Array.isArray(filters.sortDirection)) {
        sortDirection = filters.sortDirection;
      }
    }

    const orderBy: Prisma.UserOrderByWithRelationInput[] = sortBy.length
      ? sortBy.map((field, index) => ({
          [field]: (sortDirection[index] || SortOrder.ASC) as Prisma.SortOrder,
        }))
      : [{ [StudentSortFields.CREATED_AT]: Prisma.SortOrder.desc }];

    const where = {
      role: UserRole.STUDENT,
      ...(orConditions.length > 0 && { OR: orConditions }),
    };

    const [students, totalCount] = await Promise.all([
      this.usersRepo.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          ra: true,
          cpf: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy,
        skip: Number(skip),
        take: Number(pageSize),
      }),
      this.usersRepo.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    const meta: PaginationMeta = {
      currentPage: page,
      pageSize,
      totalCount,
      totalPages,
    };

    return {
      items: students,
      meta,
    };
  }

  async findStudentById(id: string) {
    const student = await this.usersRepo.findUnique({
      where: {
        id,
        role: UserRole.STUDENT,
      },
      select: {
        id: true,
        name: true,
        email: true,
        ra: true,
        cpf: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found.');
    }

    return student;
  }

  async updateStudent(id: string, updateStudentDto: UpdateStudentDto) {
    await this.findStudentById(id);

    const { email } = updateStudentDto;

    if (email) {
      const emailTaken = await this.usersRepo.findUnique({
        where: { email },
      });

      if (emailTaken && emailTaken.id !== id) {
        throw new ConflictException('This email is already in use.');
      }
    }

    const updatedStudent = await this.usersRepo.update({
      where: { id },
      data: updateStudentDto,
      select: {
        id: true,
        name: true,
        email: true,
        ra: true,
        cpf: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedStudent;
  }

  async deleteStudent(id: string) {
    await this.findStudentById(id);
    await this.usersRepo.delete({ where: { id } });
    return { message: 'Student deleted successfully.' };
  }
}
