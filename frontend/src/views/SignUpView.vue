<template>
  <v-container fluid class="pa-0 fill-height">
    <v-row no-gutters class="fill-height">
      <v-col cols="12" md="7" class="d-none d-md-flex image-section">
        <div class="overlay-content">
          <div class="content-wrapper">
            <img
              src="@/assets/logo-mais-a-educacao-negativo.svg"
              alt="+A Educação"
              class="logo-hero fade-in"
            />
            <h1 class="hero-title slide-in-left">
              Comece sua jornada educacional
            </h1>
            <p class="hero-subtitle fade-in-delayed">
              Junte-se à nossa comunidade de aprendizado e transforme seu futuro
              através da educação de qualidade
            </p>
            <div class="features-list fade-in-more-delayed">
              <div class="feature-item">
                <v-icon color="white" size="20">mdi-check-circle</v-icon>
                <span>Acesso completo ao sistema acadêmico</span>
              </div>
              <div class="feature-item">
                <v-icon color="white" size="20">mdi-check-circle</v-icon>
                <span>Acompanhamento personalizado</span>
              </div>
            </div>
          </div>
        </div>
      </v-col>

      <v-col
        cols="12"
        md="5"
        class="d-flex align-center justify-center form-section"
      >
        <v-card flat max-width="450" width="100%" class="pa-8 transparent">
          <div class="text-center mb-8">
            <img
              src="@/assets/logo-mais-a-educacao.svg"
              alt="+A Educação"
              height="50"
              class="mb-6 d-md-none"
            />
            <h2 class="text-h4 font-weight-bold text-secondary mb-2">
              Criar sua conta
            </h2>
            <p class="text-body-1 text-brand-gray">
              Preencha os dados abaixo para começar
            </p>
          </div>

          <v-form
            ref="formRef"
            v-model="formValid"
            @submit.prevent="handleRegister"
          >
            <v-text-field
              v-model="form.name"
              label="Nome completo"
              :rules="nameRules"
              prepend-inner-icon="mdi-account-outline"
              class="mb-3 custom-field"
              variant="outlined"
              color="primary"
              base-color="secondary"
            />

            <v-text-field
              v-model="form.email"
              label="Email"
              type="email"
              :rules="emailRules"
              prepend-inner-icon="mdi-email-outline"
              class="mb-3 custom-field"
              variant="outlined"
              color="primary"
              base-color="secondary"
            />

            <v-text-field
              v-model="form.cpf"
              label="CPF"
              :rules="cpfRules"
              prepend-inner-icon="mdi-card-account-details-outline"
              placeholder="000.000.000-00"
              @input="formatCPF"
              class="mb-3 custom-field"
              variant="outlined"
              color="primary"
              base-color="secondary"
            />

            <v-text-field
              v-model="form.password"
              label="Senha"
              :type="showPassword ? 'text' : 'password'"
              :rules="passwordRules"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
              class="mb-3 custom-field"
              variant="outlined"
              color="primary"
              base-color="secondary"
            />

            <v-text-field
              v-model="form.confirmPassword"
              label="Confirmar senha"
              :type="showConfirmPassword ? 'text' : 'password'"
              :rules="confirmPasswordRules"
              prepend-inner-icon="mdi-lock-check-outline"
              :append-inner-icon="
                showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'
              "
              @click:append-inner="showConfirmPassword = !showConfirmPassword"
              class="mb-4 custom-field"
              variant="outlined"
              color="primary"
              base-color="secondary"
            />

            <v-alert
              v-if="errorMessage"
              type="error"
              variant="tonal"
              density="compact"
              class="mb-4"
              rounded="lg"
              closable
              @click:close="errorMessage = ''"
            >
              {{ errorMessage }}
            </v-alert>

            <v-alert
              v-if="successMessage"
              type="success"
              variant="tonal"
              density="compact"
              class="mb-4"
              rounded="lg"
            >
              {{ successMessage }}
            </v-alert>

            <v-btn
              type="submit"
              color="primary"
              size="x-large"
              block
              :loading="loading"
              :disabled="!formValid"
              class="mb-4 brand-btn"
              elevation="0"
            >
              <v-icon left>mdi-account-plus</v-icon>
              Criar Conta
            </v-btn>

            <v-divider class="my-6">
              <span class="text-caption text-brand-gray">OU</span>
            </v-divider>

            <div class="text-center">
              <p class="text-body-2 text-brand-gray mb-2">
                Já possui uma conta?
              </p>
              <v-btn
                variant="outlined"
                color="secondary"
                size="large"
                block
                @click="navigateToSignIn"
                class="secondary-btn"
              >
                <v-icon left>mdi-login</v-icon>
                Fazer Login
              </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import type { VForm } from "vuetify/components";
import { UserRole } from "@/types/student";

const router = useRouter();
const authStore = useAuthStore();

const formRef = ref<VForm>();
const formValid = ref(false);
const loading = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const form = ref({
  name: "",
  email: "",
  cpf: "",
  password: "",
  confirmPassword: "",
});

const nameRules = [
  (v: string) => !!v || "Nome é obrigatório",
  (v: string) =>
    (v && v.length >= 3) || "Nome deve ter pelo menos 3 caracteres",
  (v: string) => /^[a-zA-ZÀ-ÿ\s]+$/.test(v) || "Nome deve conter apenas letras",
];

const emailRules = [
  (v: string) => !!v || "Email é obrigatório",
  (v: string) => /.+@.+\..+/.test(v) || "Email deve ser válido",
];

const cpfRules = [
  (v: string) => !!v || "CPF é obrigatório",
  (v: string) =>
    (v && v.replace(/\D/g, "").length === 11) || "CPF deve ter 11 dígitos",
  (v: string) => validateCPF(v) || "CPF inválido",
];

const passwordRules = [
  (v: string) => !!v || "Senha é obrigatória",
  (v: string) =>
    (v && v.length >= 8) || "Senha deve ter pelo menos 8 caracteres",
  (v: string) =>
    /[A-Z]/.test(v) || "Senha deve conter pelo menos uma letra maiúscula",
  (v: string) =>
    /[a-z]/.test(v) || "Senha deve conter pelo menos uma letra minúscula",
  (v: string) => /[0-9]/.test(v) || "Senha deve conter pelo menos um número",
];

const confirmPasswordRules = [
  (v: string) => !!v || "Confirmação de senha é obrigatória",
  (v: string) => v === form.value.password || "As senhas não coincidem",
];

const validateCPF = (cpf: string): boolean => {
  if (!cpf) return false;
  cpf = cpf.replace(/\D/g, "");
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) return false;

  return true;
};

const formatCPF = (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, "");

  if (value.length <= 11) {
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})/, "$1-$2");
    form.value.cpf = value;
  }
};

const handleRegister = async () => {
  if (!formRef.value) return;

  const { valid } = await formRef.value.validate();
  if (!valid) return;

  loading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    await authStore.register({
      name: form.value.name,
      email: form.value.email,
      cpf: form.value.cpf.replace(/\D/g, ""),
      password: form.value.password,
      confirmPassword: form.value.confirmPassword,
    });

    const currentUser = authStore.currentUser.value;

    if (currentUser?.role === UserRole.ADMIN) {
      successMessage.value =
        "Cadastro realizado com sucesso! Redirecionando...";
      setTimeout(() => {
        router.push({ name: "students" });
      }, 1500);
    } else {
      successMessage.value =
        "Cadastro realizado! Apenas administradores podem acessar o sistema. Aguarde aprovação.";
      setTimeout(() => {
        authStore.logout();
        router.push({ name: "signin" });
      }, 3000);
    }
  } catch (error) {
    errorMessage.value = (error as Error).message || "Erro ao cadastrar";
  } finally {
    loading.value = false;
  }
};

const navigateToSignIn = () => {
  router.push({ name: "signin" });
};
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}

.image-section {
  background-image: url("https://maisaedu.com.br/hubfs/site-grupo-a/masthead-carreiras-img1.jpg");
  background-size: cover;
  background-position: center;
  position: relative;
}

.overlay-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 32, 59, 0.9) 0%,
    rgba(27, 39, 49, 0.95) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
}

.content-wrapper {
  max-width: 600px;
  color: white;
}

.logo-hero {
  height: 60px;
  margin-bottom: 40px;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 20px;
  color: white;
}

.hero-subtitle {
  font-size: 1.125rem;
  font-weight: 300;
  opacity: 0.95;
  margin-bottom: 40px;
  line-height: 1.6;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.95rem;
  font-weight: 400;
}

.form-section {
  background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
}

.custom-field :deep(.v-field__outline) {
  border-width: 1.5px;
}

.custom-field:hover :deep(.v-field__outline) {
  border-color: rgba(255, 32, 59, 0.3);
}

.brand-btn {
  background: linear-gradient(135deg, #ff203b 0%, #ff4d66 100%) !important;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.brand-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(255, 32, 59, 0.25);
}

.secondary-btn {
  border-width: 2px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.secondary-btn:hover {
  background-color: rgba(27, 39, 49, 0.05);
  transform: translateY(-2px);
}

.security-info {
  background: linear-gradient(
    135deg,
    rgba(76, 175, 80, 0.03) 0%,
    rgba(76, 175, 80, 0.06) 100%
  );
  border-radius: 12px;
  border: 1px solid rgba(76, 175, 80, 0.2);
}

.fade-in {
  animation: fadeIn 0.8s ease-out;
}

.fade-in-delayed {
  animation: fadeIn 1s ease-out 0.3s both;
}

.fade-in-more-delayed {
  animation: fadeIn 1s ease-out 0.6s both;
}

.slide-in-left {
  animation: slideInLeft 0.8s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 960px) {
  .d-md-none {
    display: block !important;
  }
}
</style>
