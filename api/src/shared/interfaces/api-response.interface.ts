export interface ApiResponse<T = any> {
  code: number;
  success: boolean;
  message?: string;
  data: T;
  currentPage?: number;
  pageSize?: number;
  totalCount?: number;
  totalPages?: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginationMeta {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
