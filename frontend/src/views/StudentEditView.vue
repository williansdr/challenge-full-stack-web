<template>
  <v-container class="py-8">
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex align-center mb-4">
          <v-btn
            icon
            variant="text"
            color="secondary"
            size="large"
            @click="cancel"
            class="mr-3 back-btn"
          >
            <v-icon size="28">mdi-arrow-left</v-icon>
          </v-btn>
          <div class="fade-in">
            <h1 class="text-h3 font-weight-bold text-secondary mb-2">
              {{ isEditMode ? "Editar Aluno" : "Cadastrar Novo Aluno" }}
            </h1>
            <p class="text-body-1 text-brand-gray">
              {{
                isEditMode
                  ? "Atualize as informações do aluno"
                  : "Preencha os dados para cadastrar um novo aluno"
              }}
            </p>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-row class="mb-6" v-if="!isEditMode">
      <v-col cols="12">
        <v-card class="custom-card progress-card fade-in-delayed" elevation="0">
          <v-card-text class="pa-6">
            <div class="d-flex align-center justify-space-between mb-3">
              <span class="text-body-2 font-weight-bold text-secondary">
                Progresso do Cadastro
              </span>
              <span class="text-body-2 text-brand-gray">
                {{ formProgress }}% completo
              </span>
            </div>
            <v-progress-linear
              :model-value="formProgress"
              color="primary"
              height="8"
              rounded
              class="custom-progress"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="custom-card form-card" elevation="0" :loading="loading">
      <v-card-title class="pa-6 pb-4">
        <div class="d-flex align-center">
          <v-icon color="primary" class="mr-3" size="28">
            {{ isEditMode ? "mdi-account-edit" : "mdi-account-plus" }}
          </v-icon>
          <div>
            <h3 class="text-h6 font-weight-bold text-secondary">
              {{ isEditMode ? "Informações do Aluno" : "Dados do Aluno" }}
            </h3>
            <p class="text-caption text-brand-gray mb-0">
              {{
                isEditMode
                  ? "Apenas nome e e-mail podem ser alterados"
                  : "Todos os campos são obrigatórios"
              }}
            </p>
          </div>
        </div>
      </v-card-title>
      <v-divider class="mx-6" />
      <v-card-text class="pa-6">
        <v-form ref="formRef" v-model="formValid">
          <v-row>
            <v-col cols="12" md="6">
              <div class="field-wrapper">
                <label class="field-label">
                  <v-icon size="18" color="primary" class="mr-2"
                    >mdi-account</v-icon
                  >
                  Nome Completo *
                </label>
                <v-text-field
                  v-model="form.name"
                  :rules="nameRules"
                  variant="outlined"
                  density="comfortable"
                  placeholder="Digite o nome completo"
                  class="custom-field"
                  color="primary"
                  hide-details="auto"
                >
                  <template v-slot:prepend-inner>
                    <v-icon color="primary">mdi-account-outline</v-icon>
                  </template>
                </v-text-field>
              </div>
            </v-col>

            <v-col cols="12" md="6">
              <div class="field-wrapper">
                <label class="field-label">
                  <v-icon size="18" color="primary" class="mr-2"
                    >mdi-email</v-icon
                  >
                  E-mail *
                </label>
                <v-text-field
                  v-model="form.email"
                  :rules="emailRules"
                  variant="outlined"
                  density="comfortable"
                  type="email"
                  placeholder="Digite o e-mail"
                  class="custom-field"
                  color="primary"
                  hide-details="auto"
                >
                  <template v-slot:prepend-inner>
                    <v-icon color="primary">mdi-email-outline</v-icon>
                  </template>
                </v-text-field>
              </div>
            </v-col>

            <v-col cols="12" md="6">
              <div class="field-wrapper">
                <label class="field-label">
                  <v-icon size="18" color="primary" class="mr-2"
                    >mdi-card-account-details</v-icon
                  >
                  CPF *
                </label>
                <v-text-field
                  v-model="form.cpf"
                  :rules="cpfRules"
                  :readonly="isEditMode"
                  variant="outlined"
                  density="comfortable"
                  placeholder="000.000.000-00"
                  @input="formatCPF"
                  class="custom-field"
                  color="primary"
                  hide-details="auto"
                  :class="{ 'readonly-field': isEditMode }"
                >
                  <template v-slot:prepend-inner>
                    <v-icon :color="isEditMode ? 'grey' : 'primary'">
                      mdi-card-account-details-outline
                    </v-icon>
                  </template>
                  <template v-slot:append-inner v-if="isEditMode">
                    <v-icon color="grey">mdi-lock</v-icon>
                  </template>
                </v-text-field>
                <p v-if="isEditMode" class="field-hint">
                  <v-icon size="14" color="warning" class="mr-1"
                    >mdi-information</v-icon
                  >
                  CPF não pode ser alterado após o cadastro
                </p>
              </div>
            </v-col>

            <v-col cols="12" md="6">
              <div class="field-wrapper">
                <label class="field-label">
                  <v-icon size="18" color="primary" class="mr-2"
                    >mdi-identifier</v-icon
                  >
                  RA (Registro Acadêmico) *
                </label>
                <v-text-field
                  v-model="form.ra"
                  :rules="raRules"
                  :readonly="isEditMode"
                  variant="outlined"
                  density="comfortable"
                  placeholder="Digite o RA"
                  class="custom-field"
                  color="primary"
                  hide-details="auto"
                  :class="{ 'readonly-field': isEditMode }"
                >
                  <template v-slot:prepend-inner>
                    <v-icon :color="isEditMode ? 'grey' : 'primary'">
                      mdi-identifier
                    </v-icon>
                  </template>
                  <template v-slot:append-inner v-if="isEditMode">
                    <v-icon color="grey">mdi-lock</v-icon>
                  </template>
                </v-text-field>
                <p v-if="isEditMode" class="field-hint">
                  <v-icon size="14" color="warning" class="mr-1"
                    >mdi-information</v-icon
                  >
                  RA não pode ser alterado após o cadastro
                </p>
              </div>
            </v-col>
          </v-row>

          <v-row v-if="errorMessage">
            <v-col cols="12">
              <v-alert
                type="error"
                variant="tonal"
                rounded="lg"
                closable
                class="custom-alert"
                @click:close="errorMessage = ''"
              >
                <template v-slot:prepend>
                  <v-icon size="24">mdi-alert-circle</v-icon>
                </template>
                <div class="d-flex flex-column">
                  <span class="font-weight-bold mb-1">Erro ao processar</span>
                  <span>{{ errorMessage }}</span>
                </div>
              </v-alert>
            </v-col>
          </v-row>

          <v-row class="mt-4">
            <v-col cols="12">
              <v-card
                class="info-card"
                rounded="lg"
                variant="outlined"
                elevation="0"
              >
                <v-card-text class="pa-4">
                  <div class="d-flex align-start">
                    <v-icon color="info" size="24" class="mr-3 mt-1">
                      mdi-information
                    </v-icon>
                    <div>
                      <p
                        class="text-body-2 font-weight-bold text-secondary mb-2"
                      >
                        Informações Importantes
                      </p>
                      <ul class="info-list text-body-2 text-brand-gray">
                        <li>
                          Certifique-se de que todos os dados estão corretos
                          antes de salvar
                        </li>
                        <li v-if="!isEditMode">
                          CPF e RA não poderão ser alterados após o cadastro
                        </li>
                        <li v-if="isEditMode">
                          Apenas nome e e-mail podem ser atualizados
                        </li>
                      </ul>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider class="mx-6" />
      <v-card-actions class="pa-6 pt-4">
        <v-spacer />
        <v-btn
          variant="outlined"
          color="secondary"
          size="x-large"
          @click="cancel"
          :disabled="saving"
          class="secondary-btn mr-2"
        >
          <v-icon left>mdi-close</v-icon>
          Cancelar
        </v-btn>
        <v-btn
          color="surface"
          size="x-large"
          @click="save"
          :loading="saving"
          :disabled="!formValid"
          class="brand-btn"
          elevation="2"
        >
          <v-icon left>{{
            isEditMode ? "mdi-content-save" : "mdi-check"
          }}</v-icon>
          {{ isEditMode ? "Salvar Alterações" : "Cadastrar Aluno" }}
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-snackbar
      v-model="snackbar"
      color="success"
      rounded="lg"
      location="top right"
      :timeout="3000"
      elevation="8"
    >
      <div class="d-flex align-center">
        <v-icon class="mr-2">mdi-check-circle</v-icon>
        {{ snackbarMessage }}
      </div>
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar = false">Fechar</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import studentService from "@/services/studentService";
import type { VForm } from "vuetify/components";

const router = useRouter();
const route = useRoute();

const formRef = ref<VForm>();
const formValid = ref(false);
const loading = ref(false);
const saving = ref(false);
const snackbar = ref(false);
const snackbarMessage = ref("");
const errorMessage = ref("");

const form = ref({
  name: "",
  email: "",
  cpf: "",
  ra: "",
});

const isEditMode = computed(() => !!route.params.id);

const formProgress = computed(() => {
  let filled = 0;
  if (form.value.name) filled += 25;
  if (form.value.email) filled += 25;
  if (form.value.cpf) filled += 25;
  if (form.value.ra) filled += 25;
  return filled;
});

const nameRules = [
  (v: string) => !!v || "Nome é obrigatório",
  (v: string) =>
    (v && v.length >= 3) || "Nome deve ter pelo menos 3 caracteres",
  (v: string) =>
    (v && v.length <= 100) || "Nome deve ter no máximo 100 caracteres",
];

const emailRules = [
  (v: string) => !!v || "E-mail é obrigatório",
  (v: string) => /.+@.+\..+/.test(v) || "E-mail deve ser válido",
];

const cpfRules = [
  (v: string) => !!v || "CPF é obrigatório",
  (v: string) =>
    (v && v.replace(/\D/g, "").length === 11) || "CPF deve ter 11 dígitos",
  (v: string) => validateCPF(v) || "CPF inválido",
];

const raRules = [
  (v: string) => !!v || "RA é obrigatório",
  (v: string) => (v && v.length >= 3) || "RA deve ter pelo menos 3 caracteres",
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

const loadStudent = async () => {
  if (!isEditMode.value) return;

  loading.value = true;
  try {
    const id = route.params.id as string;
    const student = await studentService.getById(id);

    const cpf = student.cpf.includes(".")
      ? student.cpf
      : student.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

    form.value = {
      name: student.name,
      email: student.email,
      cpf: cpf,
      ra: student.ra,
    };
  } catch (error) {
    errorMessage.value = "Erro ao carregar dados do aluno";
    setTimeout(() => {
      router.push({ name: "students" });
    }, 2000);
  } finally {
    loading.value = false;
  }
};

const save = async () => {
  if (!formRef.value) return;

  const { valid } = await formRef.value.validate();
  if (!valid) return;

  saving.value = true;
  errorMessage.value = "";

  try {
    if (isEditMode.value) {
      const id = route.params.id as string;
      await studentService.update(id, {
        name: form.value.name,
        email: form.value.email,
      });
      snackbarMessage.value = "Aluno atualizado com sucesso!";
    } else {
      await studentService.create({
        name: form.value.name,
        email: form.value.email,
        cpf: form.value.cpf.replace(/\D/g, ""),
        ra: form.value.ra,
      });
      snackbarMessage.value = "Aluno cadastrado com sucesso!";
    }

    snackbar.value = true;
    setTimeout(() => {
      router.push({ name: "students" });
    }, 1500);
  } catch (error) {
    errorMessage.value = (error as Error).message || "Erro ao salvar aluno";
  } finally {
    saving.value = false;
  }
};

const cancel = () => {
  router.push({ name: "students" });
};

onMounted(() => {
  loadStudent();
});
</script>

<style scoped>
.custom-card {
  border: 1px solid rgba(27, 39, 49, 0.08);
  transition: all 0.3s ease;
  background: #ffffff;
}

.progress-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-left: 4px solid #ff203b;
}

.custom-progress :deep(.v-progress-linear__background) {
  background-color: rgba(255, 32, 59, 0.1) !important;
}

.custom-progress :deep(.v-progress-linear__determinate) {
  background: linear-gradient(90deg, #5cd460 0%, #4caf50 100%);
}

.form-card {
  position: relative;
  overflow: hidden;
}

.form-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #ff203b 0%, #ff4d66 100%);
}

.field-wrapper {
  margin-bottom: 8px;
}

.field-label {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1b2731;
  margin-bottom: 8px;
}

.field-hint {
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  color: #6c757d;
  margin-top: 4px;
  margin-left: 4px;
}

.custom-field :deep(.v-field__outline) {
  border-width: 1.5px;
  transition: all 0.3s ease;
}

.custom-field:hover :deep(.v-field__outline) {
  border-color: rgba(255, 32, 59, 0.3);
}

.custom-field :deep(.v-field--focused .v-field__outline) {
  border-color: #ff203b;
  border-width: 2px;
}

.readonly-field :deep(.v-field) {
  background-color: #f8f9fa;
}

.readonly-field :deep(.v-field__input) {
  color: #6c757d;
}

.info-card {
  background: linear-gradient(
    135deg,
    rgba(33, 150, 243, 0.03) 0%,
    rgba(33, 150, 243, 0.06) 100%
  );
  border-color: rgba(33, 150, 243, 0.2) !important;
}

.info-list {
  list-style: none;
  padding-left: 0;
}

.info-list li {
  position: relative;
  padding-left: 20px;
  margin-bottom: 8px;
}

.info-list li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: #2196f3;
  font-weight: bold;
  font-size: 1.2rem;
}

.preview-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-left: 4px solid #4caf50;
}

.preview-item {
  padding: 16px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid rgba(27, 39, 49, 0.08);
  transition: all 0.3s ease;
}

.preview-item:hover {
  box-shadow: 0 4px 12px rgba(27, 39, 49, 0.08);
  transform: translateY(-2px);
}

.custom-alert {
  border-left: 4px solid #b00020;
}

.brand-btn {
  background: linear-gradient(135deg, #ff203b 0%, #ff4d66 100%) !important;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.brand-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(255, 32, 59, 0.25) !important;
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

.back-btn {
  transition: all 0.3s ease;
}

.back-btn:hover {
  background-color: rgba(27, 39, 49, 0.05);
  transform: translateX(-4px);
}

.fade-in {
  animation: fadeIn 0.6s ease-out;
}

.fade-in-delayed {
  animation: fadeIn 0.8s ease-out 0.2s both;
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

@media (max-width: 960px) {
  .preview-item {
    margin-bottom: 16px;
  }
}
</style>
