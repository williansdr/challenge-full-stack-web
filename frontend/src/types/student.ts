export enum UserRole {
  ADMIN = "ADMIN",
  STUDENT = "STUDENT",
}

export interface Student {
  id: string;
  name: string;
  email: string;
  cpf: string;
  ra: string;
  role: UserRole;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateStudentDto {
  name: string;
  email: string;
  cpf: string;
  ra: string;
}

export interface UpdateStudentDto {
  name?: string;
  email?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export type SortDirection = "asc" | "desc";

export type StudentSortField = "name" | "email" | "cpf" | "ra" | "createdAt";

export interface StudentFilters {
  page?: number;
  pageSize?: number;
  name?: string;
  email?: string;
  cpf?: string;
  ra?: string;
  sortBy?: StudentSortField[];
  sortDirection?: SortDirection[];
}
