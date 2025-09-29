import { ApiResponseOptions } from '@nestjs/swagger';

const studentExample = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'Student Name',
  email: 'student@example.com',
  ra: '2024001',
  cpf: '987.654.321-00',
  role: 'STUDENT',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

const unauthorizedResponse = {
  '401': {
    status: 401,
    description: 'Unauthorized - Token missing or invalid',
    schema: {
      example: {
        code: 401,
        success: false,
        data: {
          message: 'Unauthorized',
          statusCode: 401,
        },
      },
    },
  } as ApiResponseOptions,
};

const forbiddenResponse = {
  '403': {
    status: 403,
    description: 'Forbidden - Admin role required',
    schema: {
      example: {
        code: 403,
        success: false,
        data: {
          message: 'Access denied. Required roles: ADMIN. Your role: STUDENT',
          error: 'Forbidden',
          statusCode: 403,
        },
      },
    },
  } as ApiResponseOptions,
};

const validationErrorResponse = {
  '400': {
    status: 400,
    description: 'Validation error',
    schema: {
      example: {
        code: 400,
        success: false,
        data: {
          message: [
            'name should not be empty',
            'email must be an email',
            'CPF must be in format 999.999.999-99 or contain only numbers',
          ],
          error: 'Bad Request',
          statusCode: 400,
        },
      },
    },
  } as ApiResponseOptions,
};

export const CreateStudentResponses = {
  '201': {
    status: 201,
    description: 'Student successfully created',
    schema: {
      example: {
        code: 201,
        success: true,
        data: studentExample,
      },
    },
  } as ApiResponseOptions,
  '400': validationErrorResponse['400'],
  '401': unauthorizedResponse['401'],
  '403': forbiddenResponse['403'],
  '409': {
    status: 409,
    description: 'Email, CPF or RA already in use',
    schema: {
      example: {
        code: 409,
        success: false,
        data: {
          message: 'This email is already in use.',
          error: 'Conflict',
          statusCode: 409,
        },
      },
    },
  } as ApiResponseOptions,
};

export const FindAllStudentsResponses = {
  '200': {
    status: 200,
    description: 'Paginated list of students',
    schema: {
      example: {
        code: 200,
        success: true,
        currentPage: 1,
        pageSize: 10,
        totalCount: 25,
        totalPages: 3,
        data: [studentExample],
      },
    },
  } as ApiResponseOptions,
  '401': unauthorizedResponse['401'],
  '403': forbiddenResponse['403'],
};

export const FindOneStudentResponses = {
  '200': {
    status: 200,
    description: 'Student found',
    schema: {
      example: {
        code: 200,
        success: true,
        data: studentExample,
      },
    },
  } as ApiResponseOptions,
  '401': unauthorizedResponse['401'],
  '403': forbiddenResponse['403'],
  '404': {
    status: 404,
    description: 'Student not found',
    schema: {
      example: {
        code: 404,
        success: false,
        data: {
          message: 'Student not found.',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  } as ApiResponseOptions,
};

export const UpdateStudentResponses = {
  '200': {
    status: 200,
    description: 'Student successfully updated',
    schema: {
      example: {
        code: 200,
        success: true,
        data: {
          ...studentExample,
          name: 'Second Student',
          email: 'second.student@example.com',
        },
      },
    },
  } as ApiResponseOptions,
  '400': validationErrorResponse['400'],
  '401': unauthorizedResponse['401'],
  '403': forbiddenResponse['403'],
  '404': {
    status: 404,
    description: 'Student not found',
    schema: {
      example: {
        code: 404,
        success: false,
        data: {
          message: 'Student not found.',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  } as ApiResponseOptions,
  '409': {
    status: 409,
    description: 'Email already in use by another student',
    schema: {
      example: {
        code: 409,
        success: false,
        data: {
          message: 'This email is already in use.',
          error: 'Conflict',
          statusCode: 409,
        },
      },
    },
  } as ApiResponseOptions,
};

export const DeleteStudentResponses = {
  '200': {
    status: 200,
    description: 'Student successfully deleted',
    schema: {
      example: {
        code: 200,
        success: true,
        data: {
          message: 'Student deleted successfully.',
        },
      },
    },
  } as ApiResponseOptions,
  '401': unauthorizedResponse['401'],
  '403': forbiddenResponse['403'],
  '404': {
    status: 404,
    description: 'Student not found',
    schema: {
      example: {
        code: 404,
        success: false,
        data: {
          message: 'Student not found.',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  } as ApiResponseOptions,
};
