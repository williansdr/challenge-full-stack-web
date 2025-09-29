import apiClient from "./apiClient";
import type { User, LoginDto, RegisterDto } from "@/types/auth";

interface LoginResponse {
  accessToken: string;
  user?: User; // Adicionar user opcional na resposta
}

class AuthService {
  async login(dto: LoginDto): Promise<{ token: string; user?: User }> {
    try {
      const response = await apiClient.post<LoginResponse>("/auth/signin", dto);

      // Se o backend retornar os dados do usuário junto com o token
      if (response.data.user) {
        return {
          token: response.data.accessToken,
          user: response.data.user,
        };
      }

      // Caso contrário, apenas retorna o token
      return { token: response.data.accessToken };
    } catch (error) {
      throw error;
    }
  }

  async register(dto: RegisterDto): Promise<{ token: string; user?: User }> {
    try {
      const { confirmPassword, ...registerData } = dto;

      const response = await apiClient.post<LoginResponse>(
        "/auth/signup",
        registerData
      );

      // Se o backend retornar os dados do usuário junto com o token
      if (response.data.user) {
        return {
          token: response.data.accessToken,
          user: response.data.user,
        };
      }

      return { token: response.data.accessToken };
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      // Busca as informações do usuário do endpoint /me
      const response = await apiClient.get<User>("/auth/me");
      return response.data;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expirationTime = payload.exp * 1000;
      return Date.now() < expirationTime;
    } catch {
      return false;
    }
  }

  logout(): void {
    // Implementação vazia - apenas limpa o estado local
  }
}

export default new AuthService();
