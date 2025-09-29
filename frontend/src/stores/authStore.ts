import { ref, computed } from "vue";
import authService from "@/services/authService";
import type { User, LoginDto, RegisterDto } from "@/types/auth";
import { UserRole } from "@/types/student";

const user = ref<User | null>(null);
const token = ref<string | null>(null);

const isAuthenticated = computed(() => !!token.value && !!user.value);
const isAdmin = computed(() => user.value?.role === UserRole.ADMIN);
const currentUser = computed(() => user.value);

const login = async (dto: LoginDto) => {
  try {
    const response = await authService.login(dto);
    token.value = response.token;

    // Salva o token primeiro para que o interceptor possa usá-lo
    localStorage.setItem("auth_token", response.token);

    // Busca as informações do usuário do endpoint /me
    const userData = await authService.getCurrentUser();
    user.value = userData;

    // Se temos informações do usuário, salva também no localStorage
    if (user.value) {
      localStorage.setItem("auth_user", JSON.stringify(user.value));
    }

    return response;
  } catch (error) {
    throw error;
  }
};

const register = async (dto: RegisterDto) => {
  try {
    const response = await authService.register(dto);
    token.value = response.token;

    // Salva o token primeiro para que o interceptor possa usá-lo
    localStorage.setItem("auth_token", response.token);

    // Busca as informações do usuário do endpoint /me
    const userData = await authService.getCurrentUser();
    user.value = userData;

    // Se temos informações do usuário, salva também no localStorage
    if (user.value) {
      localStorage.setItem("auth_user", JSON.stringify(user.value));
    }

    return response;
  } catch (error) {
    throw error;
  }
};

const logout = () => {
  authService.logout();
  user.value = null;
  token.value = null;
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_user");
};

const initAuth = async () => {
  const storedToken = localStorage.getItem("auth_token");
  const storedUser = localStorage.getItem("auth_user");

  if (storedToken) {
    try {
      const isValid = await authService.validateToken(storedToken);

      if (isValid) {
        token.value = storedToken;

        // Primeiro tenta usar o usuário armazenado no localStorage
        if (storedUser) {
          try {
            user.value = JSON.parse(storedUser);
          } catch {
            // Se falhar ao fazer parse, busca novamente
            const userData = await authService.getCurrentUser();
            user.value = userData;
            if (userData) {
              localStorage.setItem("auth_user", JSON.stringify(userData));
            }
          }
        } else {
          // Se não tem usuário armazenado, busca
          const userData = await authService.getCurrentUser();
          user.value = userData;
          if (userData) {
            localStorage.setItem("auth_user", JSON.stringify(userData));
          }
        }
      } else {
        logout();
      }
    } catch {
      logout();
    }
  }
};

// Função auxiliar para atualizar informações do usuário
const updateUserInfo = (updatedUser: Partial<User>) => {
  if (user.value) {
    user.value = { ...user.value, ...updatedUser };
    localStorage.setItem("auth_user", JSON.stringify(user.value));
  }
};

export const useAuthStore = () => {
  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    currentUser,
    login,
    register,
    logout,
    initAuth,
    updateUserInfo,
  };
};
