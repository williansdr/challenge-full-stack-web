import { Test, TestingModule } from '@nestjs/testing';
import { UserRole } from '@prisma/client';

import { RolesGuard } from '../auth/roles.guard';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { CreateStudentDto, UpdateStudentDto } from './dto';

describe('StudentsController', () => {
  let controller: StudentsController;
  let service: StudentsService;

  const mockStudentsService = {
    createStudent: jest.fn(),
    findAllStudents: jest.fn(),
    findStudentById: jest.fn(),
    updateStudent: jest.fn(),
    deleteStudent: jest.fn(),
  };

  const mockRolesGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentsController],
      providers: [
        {
          provide: StudentsService,
          useValue: mockStudentsService,
        },
      ],
    })
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    controller = module.get<StudentsController>(StudentsController);
    service = module.get<StudentsService>(StudentsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createStudentDto: CreateStudentDto = {
      name: 'Maria Silva',
      email: 'maria@student.com',
      cpf: '987.654.321-00',
      ra: 'RA2024001',
    };

    const expectedStudent = {
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
      mockStudentsService.createStudent.mockResolvedValue(expectedStudent);

      const result = await controller.create(createStudentDto);

      expect(result).toEqual(expectedStudent);
      expect(mockStudentsService.createStudent).toHaveBeenCalledWith(createStudentDto);
      expect(mockStudentsService.createStudent).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    const mockStudents = [
      {
        id: 'student-1',
        name: 'Student 1',
        email: 'student1@test.com',
        ra: 'RA001',
        cpf: '111.111.111-11',
        role: UserRole.STUDENT,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'student-2',
        name: 'Student 2',
        email: 'student2@test.com',
        ra: 'RA002',
        cpf: '222.222.222-22',
        role: UserRole.STUDENT,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    it('should return all students', async () => {
      const query = {};
      mockStudentsService.findAllStudents.mockResolvedValue(mockStudents);

      const result = await controller.findAll(query);

      expect(result).toEqual(mockStudents);
      expect(mockStudentsService.findAllStudents).toHaveBeenCalledWith(query);
      expect(mockStudentsService.findAllStudents).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no students exist', async () => {
      const query = {};
      mockStudentsService.findAllStudents.mockResolvedValue([]);

      const result = await controller.findAll(query);

      expect(result).toEqual([]);
      expect(mockStudentsService.findAllStudents).toHaveBeenCalledWith(query);
    });

    it('should pass query filters to service', async () => {
      const query = { name: 'Maria', email: 'maria@test.com' };
      mockStudentsService.findAllStudents.mockResolvedValue(mockStudents);

      const result = await controller.findAll(query);

      expect(result).toEqual(mockStudents);
      expect(mockStudentsService.findAllStudents).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
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

    it('should return a student by id', async () => {
      mockStudentsService.findStudentById.mockResolvedValue(mockStudent);

      const result = await controller.findOne(studentId);

      expect(result).toEqual(mockStudent);
      expect(mockStudentsService.findStudentById).toHaveBeenCalledWith(studentId);
      expect(mockStudentsService.findStudentById).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    const studentId = 'student-id-123';
    const updateStudentDto: UpdateStudentDto = {
      name: 'Maria Updated',
      email: 'maria.updated@student.com',
    };

    const updatedStudent = {
      id: studentId,
      name: 'Maria Updated',
      email: 'maria.updated@student.com',
      cpf: '987.654.321-00',
      ra: 'RA2024001',
      role: UserRole.STUDENT,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should update student successfully', async () => {
      mockStudentsService.updateStudent.mockResolvedValue(updatedStudent);

      const result = await controller.update(studentId, updateStudentDto);

      expect(result).toEqual(updatedStudent);
      expect(mockStudentsService.updateStudent).toHaveBeenCalledWith(studentId, updateStudentDto);
      expect(mockStudentsService.updateStudent).toHaveBeenCalledTimes(1);
    });

    it('should handle partial updates', async () => {
      const partialDto = { name: 'Only Name Updated' };
      const partiallyUpdated = {
        ...updatedStudent,
        name: 'Only Name Updated',
        email: 'maria@student.com',
      };
      mockStudentsService.updateStudent.mockResolvedValue(partiallyUpdated);

      const result = await controller.update(studentId, partialDto);

      expect(result).toEqual(partiallyUpdated);
      expect(mockStudentsService.updateStudent).toHaveBeenCalledWith(studentId, partialDto);
    });
  });

  describe('remove', () => {
    const studentId = 'student-id-123';
    const expectedResponse = { message: 'Student deleted successfully.' };

    it('should delete student successfully (hard delete)', async () => {
      mockStudentsService.deleteStudent.mockResolvedValue(expectedResponse);

      const result = await controller.remove(studentId);

      expect(result).toEqual(expectedResponse);
      expect(mockStudentsService.deleteStudent).toHaveBeenCalledWith(studentId);
      expect(mockStudentsService.deleteStudent).toHaveBeenCalledTimes(1);
    });

    it('should handle database errors', async () => {
      const error = new Error('Database connection failed');
      mockStudentsService.deleteStudent.mockRejectedValue(error);

      await expect(controller.remove(studentId)).rejects.toThrow(error);
    });
  });
});
