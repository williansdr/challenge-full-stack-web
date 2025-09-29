import { ApiResponseOptions } from '@nestjs/swagger';

export const SignupResponses = {
  '201': {
    status: 201,
    description: 'User successfully registered',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Admin Name',
        email: 'admin@example.com',
        cpf: '123.456.789-00',
        role: 'ADMIN',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  } as ApiResponseOptions,
  '400': {
    status: 400,
    description: 'Validation error',
    schema: {
      example: {
        message: [
          'email must be an email',
          'password must be longer than or equal to 8 characters',
        ],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  } as ApiResponseOptions,
  '409': {
    status: 409,
    description: 'Email or CPF already in use',
    schema: {
      example: {
        message: 'This email is already in use.',
        error: 'Conflict',
        statusCode: 409,
      },
    },
  } as ApiResponseOptions,
};

export const SigninResponses = {
  '200': {
    status: 200,
    description: 'Successfully authenticated',
    schema: {
      example: {
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      },
    },
  } as ApiResponseOptions,
  '400': {
    status: 400,
    description: 'Validation error',
    schema: {
      example: {
        message: [
          'email must be an email',
          'password must be longer than or equal to 8 characters',
        ],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  } as ApiResponseOptions,
  '401': {
    status: 401,
    description: 'Invalid credentials',
    schema: {
      example: {
        message: 'Invalid Credentials',
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  } as ApiResponseOptions,
};

export const MeResponses = {
  '200': {
    status: 200,
    description: 'Current user information',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Admin Name',
        email: 'admin@example.com',
        cpf: '123.456.789-00',
        ra: 'ADM202401',
        role: 'ADMIN',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  } as ApiResponseOptions,
  '401': {
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
    schema: {
      example: {
        message: 'Unauthorized',
        statusCode: 401,
      },
    },
  } as ApiResponseOptions,
};
