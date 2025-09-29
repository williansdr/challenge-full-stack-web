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
              Transformando vidas através da educação
            </h1>
            <p class="hero-subtitle fade-in-delayed">
              Sistema de Gestão Acadêmica - Gerencie alunos e matrículas de
              forma simples e eficiente
            </p>
            <div class="features-list fade-in-more-delayed">
              <div class="feature-item">
                <v-icon color="white" size="20">mdi-check-circle</v-icon>
                <span>Cadastro simplificado de alunos</span>
              </div>
              <div class="feature-item">
                <v-icon color="white" size="20">mdi-check-circle</v-icon>
                <span>Gestão completa de matrículas</span>
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
              Bem-vindo de volta!
            </h2>
            <p class="text-body-1 text-brand-gray">
              Entre com suas credenciais para acessar o sistema
            </p>
          </div>

          <v-form
            ref="formRef"
            v-model="formValid"
            @submit.prevent="handleLogin"
          >
            <v-text-field
              v-model="form.email"
              label="Email"
              type="email"
              :rules="emailRules"
              prepend-inner-icon="mdi-email-outline"
              class="mb-4 custom-field"
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
              class="mb-2 custom-field"
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
              <v-icon left>mdi-login</v-icon>
              Entrar no Sistema
            </v-btn>

            <v-divider class="my-6">
              <span class="text-caption text-brand-gray">OU</span>
            </v-divider>

            <div class="text-center">
              <p class="text-body-2 text-brand-gray mb-2">
                Ainda não tem uma conta?
              </p>
              <v-btn
                variant="outlined"
                color="secondary"
                size="large"
                block
                @click="navigateToSignUp"
                class="secondary-btn"
              >
                <v-icon left>mdi-account-plus</v-icon>
                Criar Conta
              </v-btn>
            </div>
          </v-form>

          <v-expand-transition>
            <v-card
              v-if="showTestCredentials"
              class="mt-6 pa-4 test-credentials-card"
              rounded="lg"
              variant="outlined"
            >
              <div class="d-flex justify-space-between align-center mb-2">
                <span class="text-caption font-weight-bold text-primary">
                  AMBIENTE DE TESTE
                </span>
                <v-btn
                  icon="mdi-close"
                  size="x-small"
                  variant="text"
                  @click="showTestCredentials = false"
                />
              </div>
              <div class="text-caption">
                <div class="mb-1">
                  <strong>Admin:</strong> admin@maisaeducacao.com.br / 12345678
                </div>
              </div>
            </v-card>
          </v-expand-transition>

          <div class="text-center mt-4">
            <v-btn
              v-if="!showTestCredentials"
              variant="text"
              size="small"
              color="brand-gray"
              @click="showTestCredentials = true"
            >
              <v-icon left size="small">mdi-test-tube</v-icon>
              Ver credenciais de teste
            </v-btn>
          </div>
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

const router = useRouter();
const authStore = useAuthStore();

const formRef = ref<VForm>();
const formValid = ref(false);
const loading = ref(false);
const showPassword = ref(false);
const errorMessage = ref("");
const showTestCredentials = ref(true);

const form = ref({
  email: "",
  password: "",
});

const emailRules = [
  (v: string) => !!v || "Email é obrigatório",
  (v: string) => /.+@.+\..+/.test(v) || "Email deve ser válido",
];

const passwordRules = [
  (v: string) => !!v || "Senha é obrigatória",
  (v: string) =>
    (v && v.length >= 6) || "Senha deve ter pelo menos 6 caracteres",
];

const handleLogin = async () => {
  if (!formRef.value) return;

  const { valid } = await formRef.value.validate();
  if (!valid) return;

  loading.value = true;
  errorMessage.value = "";

  try {
    await authStore.login({
      email: form.value.email,
      password: form.value.password,
    });

    if (authStore.isAdmin.value) {
      router.push({ name: "students" });
    } else {
      errorMessage.value =
        "Acesso negado. Apenas administradores podem acessar o sistema.";
      authStore.logout();
    }
  } catch (error) {
    errorMessage.value = (error as Error).message || "Erro ao fazer login";
  } finally {
    loading.value = false;
  }
};

const navigateToSignUp = () => {
  router.push({ name: "signup" });
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

.test-credentials-card {
  background: linear-gradient(
    135deg,
    rgba(255, 32, 59, 0.03) 0%,
    rgba(255, 77, 102, 0.03) 100%
  );
  border-color: rgba(255, 32, 59, 0.2) !important;
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
</style>
