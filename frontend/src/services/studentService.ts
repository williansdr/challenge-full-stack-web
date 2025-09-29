import apiClient from "./apiClient";
import type {
  Student,
  CreateStudentDto,
  UpdateStudentDto,
  StudentFilters,
  PaginatedResponse,
} from "@/types/student";

class StudentService {
  async getAll(filters?: StudentFilters): Promise<PaginatedResponse<Student>> {
    try {
      const params: Record<string, string | number> = {};

      if (filters?.page) params.page = filters.page;
      if (filters?.pageSize) params.pageSize = filters.pageSize;
      if (filters?.name) params.name = filters.name;
      if (filters?.email) params.email = filters.email;
      if (filters?.cpf) params.cpf = filters.cpf;
      if (filters?.ra) params.ra = filters.ra;

      if (filters?.sortBy && filters.sortBy.length > 0) {
        params.sortBy = filters.sortBy.join(",");
      }
      if (filters?.sortDirection && filters.sortDirection.length > 0) {
        params.sortDirection = filters.sortDirection.join(",");
      }

      const fullResponse = await apiClient.get("/students", { params });

      return {
        data: fullResponse.data.data,
        currentPage: fullResponse.data.currentPage,
        pageSize: fullResponse.data.pageSize,
        totalCount: fullResponse.data.totalCount,
        totalPages: fullResponse.data.totalPages,
      };
    } catch (error) {
      throw error;
    }
  }

  async getById(id: string): Promise<Student> {
    try {
      const response = await apiClient.get<Student>(`/students/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async create(dto: CreateStudentDto): Promise<Student> {
    try {
      const formattedDto = {
        ...dto,
        cpf: dto.cpf.replace(/\D/g, ""),
      };

      const response = await apiClient.post<Student>("/students", formattedDto);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, dto: UpdateStudentDto): Promise<Student> {
    try {
      const response = await apiClient.patch<Student>(`/students/${id}`, dto);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`/students/${id}`);
    } catch (error) {
      throw error;
    }
  }
}

export default new StudentService();
