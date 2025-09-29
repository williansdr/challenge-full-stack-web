import { UserRole } from '@prisma/client';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';

import { StudentsService } from './students.service';
import { SortOrder, StudentSortFields } from '../../shared/enums';
import { UsersRepository } from '../../shared/database/repositories/users.repositories';
import { CreateStudentDto, FindAllStudentsDto, UpdateStudentDto } from './dto';

describe('StudentsService', () => {
  let service: StudentsService;
  let usersRepository: UsersRepository;

  const mockUsersRepository = {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<StudentsService>(StudentsService);
    usersRepository = module.get<UsersRepository>(UsersRepository);

    jest.clearAllMocks();
  });

  describe('createStudent', () => {
    const createStudentDto: CreateStudentDto = {
      name: 'Maria Silva',
      email: 'maria@student.com',
      cpf: '987.654.321-00',
      ra: 'RA2024001',
    };

    const mockStudent = {
      id: 'student-id-123',
      name: 'Maria Silva',
      email: 'maria@student.com',
      cpf: '987.654.321-00',
      ra: 'RA2024001',
      role: UserRole.STUDENT,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should create a new student successfully', async () => {
      mockUsersRepository.findUnique.mockResolvedValue(null);
      mockUsersRepository.create.mockResolvedValue(mockStudent);

      const result = await service.createStudent(createStudentDto);

      expect(result).toEqual(mockStudent);
      expect(mockUsersRepository.findUnique).toHaveBeenCalledTimes(3);
      expect(mockUsersRepository.findUnique).toHaveBeenCalledWith({
        where: { email: createStudentDto.email },
      });
      expect(mockUsersRepository.findUnique).toHaveBeenCalledWith({
        where: { cpf: createStudentDto.cpf },
      });
      expect(mockUsersRepository.findUnique).toHaveBeenCalledWith({
        where: { ra: createStudentDto.ra },
      });
      expect(mockUsersRepository.create).toHaveBeenCalledWith({
        data: {
          name: createStudentDto.name,
          email: createStudentDto.email,
          ra: createStudentDto.ra,
          cpf: createStudentDto.cpf,
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
    });

    it('should format CPF before checking and saving', async () => {
      const unformattedCpfDto = {
        ...createStudentDto,
        cpf: '98765432100',
      };
      mockUsersRepository.findUnique.mockResolvedValue(null);
      mockUsersRepository.create.mockResolvedValue(mockStudent);

      await service.createStudent(unformattedCpfDto);

      expect(mockUsersRepository.findUnique).toHaveBeenCalledWith({
        where: { cpf: '987.654.321-00' },
      });
      expect(mockUsersRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            cpf: '987.654.321-00',
          }),
        }),
      );
    });

    it('should throw ConflictException when email is already in use', async () => {
      mockUsersRepository.findUnique
        .mockResolvedValueOnce(mockStudent)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);

      await expect(service.createStudent(createStudentDto)).rejects.toThrow(
        new ConflictException('This email is already in use.'),
      );
      expect(mockUsersRepository.create).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when CPF is already in use', async () => {
      mockUsersRepository.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockStudent)
        .mockResolvedValueOnce(null);

      await expect(service.createStudent(createStudentDto)).rejects.toThrow(
        new ConflictException('This CPF is already in use.'),
      );
      expect(mockUsersRepository.create).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when RA is already in use', async () => {
      mockUsersRepository.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockStudent);

      await expect(service.createStudent(createStudentDto)).rejects.toThrow(
        new ConflictException('This RA is already in use.'),
      );
      expect(mockUsersRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAllStudents', () => {
    const mockStudents = [
      {
        id: '1',
        name: 'Alice Silva',
        email: 'alice@test.com',
        ra: 'RA001',
        cpf: '111.111.111-11',
        role: UserRole.STUDENT,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: '2',
        name: 'Bob Santos',
        email: 'bob@test.com',
        ra: 'RA002',
        cpf: '222.222.222-22',
        role: UserRole.STUDENT,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      },
      {
        id: '3',
        name: 'Carlos Oliveira',
        email: 'carlos@test.com',
        ra: 'RA003',
        cpf: '333.333.333-33',
        role: UserRole.STUDENT,
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
      },
    ];

    it('should return all active students', async () => {
      mockUsersRepository.findMany.mockResolvedValue(mockStudents);
      mockUsersRepository.count.mockResolvedValue(mockStudents.length);

      const result = await service.findAllStudents();

      expect(result.items).toEqual(mockStudents);
      expect(result.meta).toEqual({
        currentPage: 1,
        pageSize: 10,
        totalCount: 3,
        totalPages: 1,
      });
      expect(mockUsersRepository.findMany).toHaveBeenCalledWith({
        where: {
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
        orderBy: [{ createdAt: 'desc' }],
        skip: 0,
        take: 10,
      });
    });

    it('should return empty array when no students exist', async () => {
      mockUsersRepository.findMany.mockResolvedValue([]);
      mockUsersRepository.count.mockResolvedValue(0);

      const result = await service.findAllStudents();

      expect(result.items).toEqual([]);
      expect(result.meta.totalCount).toBe(0);
      expect(mockUsersRepository.findMany).toHaveBeenCalled();
    });

    it('should filter by name (case insensitive partial match)', async () => {
      const filters: FindAllStudentsDto = { name: 'silva' };
      mockUsersRepository.findMany.mockResolvedValue([mockStudents[0]]);
      mockUsersRepository.count.mockResolvedValue(1);

      await service.findAllStudents(filters);

      expect(mockUsersRepository.findMany).toHaveBeenCalledWith({
        where: {
          role: UserRole.STUDENT,
          OR: [
            {
              name: {
                contains: 'silva',
                mode: 'insensitive',
              },
            },
          ],
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
        orderBy: [{ createdAt: 'desc' }],
        skip: 0,
        take: 10,
      });
    });

    it('should filter by email (case insensitive partial match)', async () => {
      const filters: FindAllStudentsDto = { email: 'alice' };
      mockUsersRepository.findMany.mockResolvedValue([mockStudents[0]]);
      mockUsersRepository.count.mockResolvedValue(1);

      await service.findAllStudents(filters);

      expect(mockUsersRepository.findMany).toHaveBeenCalledWith({
        where: {
          role: UserRole.STUDENT,
          OR: [
            {
              email: {
                contains: 'alice',
                mode: 'insensitive',
              },
            },
          ],
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
        orderBy: [{ createdAt: 'desc' }],
        skip: 0,
        take: 10,
      });
    });

    it('should filter by CPF (exact match, formatted)', async () => {
      const filters: FindAllStudentsDto = { cpf: '111.111.111-11' };
      mockUsersRepository.findMany.mockResolvedValue([mockStudents[0]]);
      mockUsersRepository.count.mockResolvedValue(1);

      await service.findAllStudents(filters);

      expect(mockUsersRepository.findMany).toHaveBeenCalledWith({
        where: {
          role: UserRole.STUDENT,
          OR: [
            {
              cpf: '111.111.111-11',
            },
          ],
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
        orderBy: [{ createdAt: 'desc' }],
        skip: 0,
        take: 10,
      });
    });

    it('should filter by CPF (unformatted input should be formatted)', async () => {
      const filters: FindAllStudentsDto = { cpf: '11111111111' };
      mockUsersRepository.findMany.mockResolvedValue([mockStudents[0]]);
      mockUsersRepository.count.mockResolvedValue(1);

      await service.findAllStudents(filters);

      expect(mockUsersRepository.findMany).toHaveBeenCalledWith({
        where: {
          role: UserRole.STUDENT,
          OR: [
            {
              cpf: '111.111.111-11',
            },
          ],
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
        orderBy: [{ createdAt: 'desc' }],
        skip: 0,
        take: 10,
      });
    });

    it('should filter by RA (exact match)', async () => {
      const filters: FindAllStudentsDto = { ra: 'RA001' };
      mockUsersRepository.findMany.mockResolvedValue([mockStudents[0]]);
      mockUsersRepository.count.mockResolvedValue(1);

      await service.findAllStudents(filters);

      expect(mockUsersRepository.findMany).toHaveBeenCalledWith({
        where: {
          role: UserRole.STUDENT,
          OR: [
            {
              ra: 'RA001',
            },
          ],
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
        orderBy: [{ createdAt: 'desc' }],
        skip: 0,
        take: 10,
      });
    });

    it('should transform sortDirection string to array', () => {
      const plainObject = {
        sortDirection: 'asc,desc,asc',
      };

      const dto = plainToClass(FindAllStudentsDto, plainObject);

      expect(dto.sortDirection).toEqual(['asc', 'desc', 'asc']);
    });

    it('should pass validation with valid sortBy fields', async () => {
      const dto = plainToClass(FindAllStudentsDto, {
        sortBy: ['name', 'email', 'createdAt'],
        sortDirection: ['asc', 'desc', 'asc'],
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with invalid sortBy fields', async () => {
      const dto = plainToClass(FindAllStudentsDto, {
        sortBy: ['invalid_field'],
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('sortBy');
    });

    it('should sort by single field ascending', async () => {
      const filters: FindAllStudentsDto = {
        sortBy: [StudentSortFields.NAME],
        sortDirection: [SortOrder.ASC],
      };
      mockUsersRepository.findMany.mockResolvedValue(mockStudents);
      mockUsersRepository.count.mockResolvedValue(mockStudents.length);

      await service.findAllStudents(filters);

      expect(mockUsersRepository.findMany).toHaveBeenCalledWith({
        where: {
          role: UserRole.STUDENT,
        },
        select: expect.any(Object),
        orderBy: [{ name: SortOrder.ASC }],
        skip: 0,
        take: 10,
      });
    });

    it('should sort by single field descending', async () => {
      const filters: FindAllStudentsDto = {
        sortBy: [StudentSortFields.EMAIL],
        sortDirection: [SortOrder.DESC],
      };
      mockUsersRepository.findMany.mockResolvedValue(mockStudents);
      mockUsersRepository.count.mockResolvedValue(mockStudents.length);

      await service.findAllStudents(filters);

      expect(mockUsersRepository.findMany).toHaveBeenCalledWith({
        where: {
          role: UserRole.STUDENT,
        },
        select: expect.any(Object),
        orderBy: [{ email: 'desc' }],
        skip: 0,
        take: 10,
      });
    });

    it('should sort by multiple fields with different directions', async () => {
      const filters: FindAllStudentsDto = {
        sortBy: [StudentSortFields.NAME, StudentSortFields.EMAIL],
        sortDirection: [SortOrder.ASC, SortOrder.DESC],
      };
      mockUsersRepository.findMany.mockResolvedValue(mockStudents);
      mockUsersRepository.count.mockResolvedValue(mockStudents.length);

      await service.findAllStudents(filters);

      expect(mockUsersRepository.findMany).toHaveBeenCalledWith({
        where: {
          role: UserRole.STUDENT,
        },
        select: expect.any(Object),
        orderBy: [{ name: 'asc' }, { email: 'desc' }],
        skip: 0,
        take: 10,
      });
    });
  });

  describe('findStudentById', () => {
    const studentId = 'student-id-123';
    const mockStudent = {
      id: studentId,
      name: 'Maria Silva',
      email: 'maria@student.com',
      cpf: '987.654.321-00',
      ra: 'RA2024001',
      role: UserRole.STUDENT,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should return a student when found', async () => {
      mockUsersRepository.findUnique.mockResolvedValue(mockStudent);

      const result = await service.findStudentById(studentId);

      expect(result).toEqual(mockStudent);
      expect(mockUsersRepository.findUnique).toHaveBeenCalledWith({
        where: {
          id: studentId,
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
    });

    it('should throw NotFoundException when student not found', async () => {
      mockUsersRepository.findUnique.mockResolvedValue(null);

      await expect(service.findStudentById(studentId)).rejects.toThrow(
        new NotFoundException('Student not found.'),
      );
    });

    it('should not return users with ADMIN role', async () => {
      mockUsersRepository.findUnique.mockResolvedValue(null);

      await expect(service.findStudentById(studentId)).rejects.toThrow(
        new NotFoundException('Student not found.'),
      );
      expect(mockUsersRepository.findUnique).toHaveBeenCalledWith({
        where: {
          id: studentId,
          role: UserRole.STUDENT,
        },
        select: expect.any(Object),
      });
    });
  });

  describe('updateStudent', () => {
    const studentId = 'student-id-123';
    const updateStudentDto: UpdateStudentDto = {
      name: 'Maria Updated',
      email: 'maria.updated@student.com',
    };

    const existingStudent = {
      id: studentId,
      name: 'Maria Silva',
      email: 'maria@student.com',
      cpf: '987.654.321-00',
      ra: 'RA2024001',
      role: UserRole.STUDENT,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedStudent = {
      ...existingStudent,
      ...updateStudentDto,
    };

    it('should update student successfully', async () => {
      mockUsersRepository.findUnique
        .mockResolvedValueOnce(existingStudent)
        .mockResolvedValueOnce(null);
      mockUsersRepository.update.mockResolvedValue(updatedStudent);

      const result = await service.updateStudent(studentId, updateStudentDto);

      expect(result).toEqual(updatedStudent);
      expect(mockUsersRepository.update).toHaveBeenCalledWith({
        where: { id: studentId },
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
    });

    it('should update only the name when email is not provided', async () => {
      const nameOnlyDto = { name: 'New Name' };
      mockUsersRepository.findUnique.mockResolvedValueOnce(existingStudent);
      mockUsersRepository.update.mockResolvedValue({
        ...existingStudent,
        name: 'New Name',
      });

      const result = await service.updateStudent(studentId, nameOnlyDto);

      expect(result.name).toBe('New Name');
      expect(mockUsersRepository.findUnique).toHaveBeenCalledTimes(1); // Only findStudentById
    });

    it('should throw NotFoundException when student not found', async () => {
      mockUsersRepository.findUnique.mockResolvedValue(null);

      await expect(service.updateStudent(studentId, updateStudentDto)).rejects.toThrow(
        new NotFoundException('Student not found.'),
      );
      expect(mockUsersRepository.update).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when email is already in use by another student', async () => {
      const anotherStudent = {
        ...existingStudent,
        id: 'another-student-id',
        email: updateStudentDto.email,
      };
      mockUsersRepository.findUnique
        .mockResolvedValueOnce(existingStudent)
        .mockResolvedValueOnce(anotherStudent);

      await expect(service.updateStudent(studentId, updateStudentDto)).rejects.toThrow(
        new ConflictException('This email is already in use.'),
      );
      expect(mockUsersRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteStudent', () => {
    const studentId = 'student-id-123';
    const mockStudent = {
      id: studentId,
      name: 'Maria Silva',
      email: 'maria@student.com',
      cpf: '987.654.321-00',
      ra: 'RA2024001',
      role: UserRole.STUDENT,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should delete student successfully (hard delete)', async () => {
      mockUsersRepository.findUnique.mockResolvedValue(mockStudent);
      mockUsersRepository.delete.mockResolvedValue(mockStudent);

      const result = await service.deleteStudent(studentId);

      expect(result).toEqual({ message: 'Student deleted successfully.' });
      expect(mockUsersRepository.findUnique).toHaveBeenCalled();
      expect(mockUsersRepository.delete).toHaveBeenCalledWith({
        where: { id: studentId },
      });
    });

    it('should throw NotFoundException when student not found', async () => {
      mockUsersRepository.findUnique.mockResolvedValue(null);

      await expect(service.deleteStudent(studentId)).rejects.toThrow(
        new NotFoundException('Student not found.'),
      );
      expect(mockUsersRepository.delete).not.toHaveBeenCalled();
    });
  });
});
