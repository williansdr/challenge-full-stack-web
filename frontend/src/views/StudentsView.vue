<template>
  <v-container class="py-8">
    <v-row class="mb-6 align-center">
      <v-col cols="12" md="6">
        <div class="fade-in">
          <h1 class="text-h3 font-weight-bold text-secondary mb-2">
            Gestão de Alunos
          </h1>
          <p class="text-body-1 text-brand-gray">
            Gerencie todos os alunos cadastrados no sistema
          </p>
        </div>
      </v-col>
      <v-col cols="12" md="6" class="text-md-right">
        <v-btn
          color="primary"
          size="x-large"
          elevation="2"
          class="brand-btn fade-in-delayed"
          @click="navigateToNew"
        >
          <v-icon left>mdi-plus-circle</v-icon>
          Cadastrar Novo Aluno
        </v-btn>
      </v-col>
    </v-row>

    <v-card class="mb-6 custom-card filter-card" elevation="0">
      <v-card-title class="pa-6 pb-4">
        <div class="d-flex align-center">
          <v-icon color="primary" class="mr-3" size="28"
            >mdi-filter-variant</v-icon
          >
          <div>
            <h3 class="text-h6 font-weight-bold text-secondary">
              Filtros de Busca
            </h3>
            <p class="text-caption text-brand-gray mb-0">
              Refine sua pesquisa usando os campos abaixo
            </p>
          </div>
        </div>
      </v-card-title>
      <v-divider class="mx-6" />
      <v-card-text class="pa-6">
        <v-row>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="filters.name"
              label="Nome do Aluno"
              variant="outlined"
              density="comfortable"
              clearable
              prepend-inner-icon="mdi-account-search"
              class="custom-field"
              color="primary"
              @keyup.enter="applyFilters"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="filters.email"
              label="E-mail"
              variant="outlined"
              density="comfortable"
              clearable
              prepend-inner-icon="mdi-email-search"
              class="custom-field"
              color="primary"
              @keyup.enter="applyFilters"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="filters.cpf"
              label="CPF"
              variant="outlined"
              density="comfortable"
              clearable
              prepend-inner-icon="mdi-card-account-details"
              class="custom-field"
              color="primary"
              @keyup.enter="applyFilters"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="filters.ra"
              label="RA"
              variant="outlined"
              density="comfortable"
              clearable
              prepend-inner-icon="mdi-identifier"
              class="custom-field"
              color="primary"
              @keyup.enter="applyFilters"
            />
          </v-col>
        </v-row>
        <v-row class="mt-2">
          <v-col class="d-flex justify-end gap-2">
            <v-btn
              v-if="hasActiveFilters"
              variant="outlined"
              color="error"
              size="large"
              @click="clearFilters"
              class="secondary-btn mr-2"
            >
              <v-icon left>mdi-filter-off</v-icon>
              Limpar Filtros
            </v-btn>
            <v-btn
              color="primary"
              size="large"
              :loading="loading"
              @click="applyFilters"
              class="brand-btn"
              elevation="2"
            >
              <v-icon left>mdi-magnify</v-icon>
              Buscar Alunos
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card class="custom-card table-card" elevation="0">
      <v-card-title class="pa-6 pb-4">
        <div class="d-flex align-center justify-space-between w-100">
          <div class="d-flex align-center">
            <v-icon color="primary" class="mr-3" size="28"
              >mdi-table-large</v-icon
            >
            <div>
              <h3 class="text-h6 font-weight-bold text-secondary">
                Lista de Alunos
              </h3>
              <p class="text-caption text-brand-gray mb-0">
                {{ startItem }} - {{ endItem }} de {{ pagination.totalCount }}
                alunos
              </p>
            </div>
          </div>
        </div>
      </v-card-title>
      <v-divider class="mx-6" />
      <v-card-text class="pa-0">
        <v-data-table-server
          v-model:page="pagination.page"
          :headers="headers"
          :items="students"
          :items-length="pagination.totalCount"
          :items-per-page="pagination.pageSize"
          :loading="loading"
          class="custom-data-table"
          multi-sort
          @update:options="onOptionsUpdate"
        >
          <template v-slot:header.ra="{ column }">
            <span @click="handleSort('ra', $event)" class="sortable-header">
              {{ column.title }}
              <v-icon size="small" class="ml-1">
                {{ getCustomSortIcon("ra", sortBy) }}
              </v-icon>
            </span>
          </template>

          <template v-slot:header.name="{ column }">
            <span @click="handleSort('name', $event)" class="sortable-header">
              {{ column.title }}
              <v-icon size="small" class="ml-1">
                {{ getCustomSortIcon("name", sortBy) }}
              </v-icon>
            </span>
          </template>

          <template v-slot:header.email="{ column }">
            <span @click="handleSort('email', $event)" class="sortable-header">
              {{ column.title }}
              <v-icon size="small" class="ml-1">
                {{ getCustomSortIcon("email", sortBy) }}
              </v-icon>
            </span>
          </template>

          <template v-slot:header.cpf="{ column }">
            <span @click="handleSort('cpf', $event)" class="sortable-header">
              {{ column.title }}
              <v-icon size="small" class="ml-1">
                {{ getCustomSortIcon("cpf", sortBy) }}
              </v-icon>
            </span>
          </template>

          <template v-slot:item.ra="{ item }">
            <span class="font-weight-medium text-secondary">{{ item.ra }}</span>
          </template>

          <template v-slot:item.name="{ item }">
            <div class="d-flex align-center py-2">
              <v-avatar size="40" color="primary" class="mr-3">
                <span class="text-white font-weight-bold">
                  {{ getInitials(item.name) }}
                </span>
              </v-avatar>
              <span class="font-weight-medium text-secondary">{{
                item.name
              }}</span>
            </div>
          </template>

          <template v-slot:item.cpf="{ item }">
            <span class="text-brand-gray">{{ formatCPF(item.cpf) }}</span>
          </template>

          <template v-slot:item.actions="{ item }">
            <div class="action-buttons">
              <v-btn
                icon
                size="small"
                variant="text"
                color="primary"
                @click="editStudent(item.id)"
                class="action-btn"
              >
                <v-icon size="20">mdi-pencil</v-icon>
                <v-tooltip activator="parent" location="top">Editar</v-tooltip>
              </v-btn>
              <v-btn
                icon
                size="small"
                variant="text"
                color="error"
                @click="openDeleteDialog(item)"
                class="action-btn"
              >
                <v-icon size="20">mdi-delete</v-icon>
                <v-tooltip activator="parent" location="top">Excluir</v-tooltip>
              </v-btn>
            </div>
          </template>

          <template v-slot:loading>
            <div class="pa-8">
              <v-skeleton-loader type="table-row@5" />
            </div>
          </template>

          <template v-slot:no-data>
            <div class="text-center py-12">
              <v-icon size="80" color="brand-gray" class="mb-4">
                mdi-account-off
              </v-icon>
              <h3 class="text-h6 text-secondary mb-2">
                {{
                  hasActiveFilters
                    ? "Nenhum resultado encontrado"
                    : "Nenhum aluno cadastrado"
                }}
              </h3>
              <p class="text-body-2 text-brand-gray">
                {{
                  hasActiveFilters
                    ? "Tente ajustar os filtros de busca"
                    : "Comece cadastrando um novo aluno"
                }}
              </p>
            </div>
          </template>

          <template v-slot:bottom>
            <div class="table-footer pa-6">
              <div
                class="d-flex justify-space-between align-center flex-wrap gap-4"
              >
                <div class="d-flex align-center">
                  <span class="text-body-2 text-brand-gray mr-3"
                    >Itens por página:</span
                  >
                  <v-select
                    v-model="pagination.pageSize"
                    :items="pageSizeOptions"
                    variant="outlined"
                    density="compact"
                    hide-details
                    class="page-size-select"
                    color="primary"
                    @update:model-value="onPageSizeChange"
                  />
                </div>
                <v-pagination
                  v-model="pagination.page"
                  :length="pagination.totalPages"
                  :total-visible="7"
                  color="primary"
                  class="custom-pagination"
                  @update:model-value="loadStudents"
                />
              </div>
            </div>
          </template>
        </v-data-table-server>
      </v-card-text>
    </v-card>

    <v-dialog v-model="deleteDialog" max-width="500" persistent>
      <v-card rounded="lg" elevation="8">
        <v-card-title class="pa-6 pb-4">
          <div class="d-flex align-center">
            <v-avatar size="48" color="error" class="mr-3">
              <v-icon color="white" size="28">mdi-alert</v-icon>
            </v-avatar>
            <div>
              <h3 class="text-h6 font-weight-bold text-secondary">
                Confirmar Exclusão
              </h3>
              <p class="text-caption text-brand-gray mb-0">
                Esta ação não pode ser desfeita
              </p>
            </div>
          </div>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <p class="text-body-1 text-secondary mb-2">
            Tem certeza que deseja excluir o aluno:
          </p>
          <div class="pa-4 rounded-lg delete-info-box">
            <div class="d-flex align-center">
              <v-avatar size="40" color="primary" class="mr-3">
                <span class="text-white font-weight-bold">
                  {{ getInitials(studentToDelete?.name || "") }}
                </span>
              </v-avatar>
              <div>
                <p class="text-body-1 font-weight-bold text-secondary mb-0">
                  {{ studentToDelete?.name }}
                </p>
                <p class="text-caption text-brand-gray mb-0">
                  RA: {{ studentToDelete?.ra }}
                </p>
              </div>
            </div>
          </div>
          <v-alert
            type="warning"
            variant="tonal"
            density="compact"
            class="mt-4"
            rounded="lg"
          >
            Todos os dados serão permanentemente removidos do sistema
          </v-alert>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-6 pt-4">
          <v-spacer />
          <v-btn
            variant="outlined"
            color="secondary"
            size="large"
            @click="deleteDialog = false"
            :disabled="deleting"
            class="secondary-btn"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="surface"
            size="large"
            :loading="deleting"
            @click="confirmDelete"
            class="brand-btn"
            elevation="2"
          >
            <v-icon left>mdi-delete</v-icon>
            Confirmar Exclusão
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      rounded="lg"
      location="top right"
      :timeout="3000"
      elevation="8"
    >
      <div class="d-flex align-center">
        <v-icon class="mr-2">
          {{
            snackbarColor === "success"
              ? "mdi-check-circle"
              : "mdi-alert-circle"
          }}
        </v-icon>
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
import { useRouter } from "vue-router";
import studentService from "@/services/studentService";
import type {
  Student,
  StudentFilters,
  StudentSortField,
  SortDirection,
} from "@/types/student";

const router = useRouter();

const students = ref<Student[]>([]);
const loading = ref(false);
const deleteDialog = ref(false);
const studentToDelete = ref<Student | null>(null);
const deleting = ref(false);
const snackbar = ref(false);
const snackbarMessage = ref("");
const snackbarColor = ref<"success" | "error">("success");

const filters = ref<
  Omit<StudentFilters, "page" | "pageSize" | "sortBy" | "sortDirection">
>({
  name: "",
  email: "",
  cpf: "",
  ra: "",
});

const pagination = ref({
  page: 1,
  pageSize: 10,
  totalCount: 0,
  totalPages: 0,
});

const pageSizeOptions = [5, 10, 25, 50, 100];

const sortBy = ref<Array<{ key: string; order: "asc" | "desc" }>>([]);

const hasActiveFilters = computed(() => {
  return !!(
    filters.value.name ||
    filters.value.email ||
    filters.value.cpf ||
    filters.value.ra
  );
});

const startItem = computed(() => {
  if (pagination.value.totalCount === 0) return 0;
  return (pagination.value.page - 1) * pagination.value.pageSize + 1;
});

const endItem = computed(() => {
  const end = pagination.value.page * pagination.value.pageSize;
  return end > pagination.value.totalCount ? pagination.value.totalCount : end;
});

const headers = [
  { title: "RA", key: "ra", sortable: true, width: "120" },
  { title: "Nome", key: "name", sortable: true },
  { title: "Email", key: "email", sortable: true },
  { title: "CPF", key: "cpf", sortable: true, width: "150" },
  {
    title: "Ações",
    key: "actions",
    sortable: false,
    align: "center" as const,
    width: 120,
  },
];

const loadStudents = async () => {
  loading.value = true;
  try {
    const filterParams: StudentFilters = {
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
      ...(filters.value.name && { name: filters.value.name }),
      ...(filters.value.email && { email: filters.value.email }),
      ...(filters.value.cpf && { cpf: filters.value.cpf }),
      ...(filters.value.ra && { ra: filters.value.ra }),
    };

    if (sortBy.value.length > 0) {
      filterParams.sortBy = sortBy.value.map((s) => s.key as StudentSortField);
      filterParams.sortDirection = sortBy.value.map(
        (s) => s.order as SortDirection
      );
    }

    const response = await studentService.getAll(filterParams);

    students.value = response.data;
    pagination.value = {
      page: response.currentPage,
      pageSize: response.pageSize,
      totalCount: response.totalCount,
      totalPages: response.totalPages,
    };
  } catch (error) {
    showMessage("Erro ao carregar alunos", "error");
  } finally {
    loading.value = false;
  }
};

const applyFilters = () => {
  pagination.value.page = 1;
  loadStudents();
};

const clearFilters = () => {
  filters.value = {
    name: "",
    email: "",
    cpf: "",
    ra: "",
  };
  applyFilters();
};

const onPageSizeChange = () => {
  pagination.value.page = 1;
  loadStudents();
};

const onOptionsUpdate = (options: any) => {
  if (options.sortBy && Array.isArray(options.sortBy)) {
    sortBy.value = options.sortBy;
    loadStudents();
  }
};

const handleSort = (columnKey: string, event: MouseEvent) => {
  const existingIndex = sortBy.value.findIndex(
    (item) => item.key === columnKey
  );

  if (event.shiftKey) {
    if (existingIndex === -1) {
      sortBy.value = [...sortBy.value, { key: columnKey, order: "asc" }];
    } else {
      const currentOrder = sortBy.value[existingIndex].order;
      if (currentOrder === "asc") {
        sortBy.value = sortBy.value.map((item, idx) =>
          idx === existingIndex
            ? { key: columnKey, order: "desc" as const }
            : item
        );
      } else {
        sortBy.value = sortBy.value.filter((_, idx) => idx !== existingIndex);
      }
    }
  } else {
    if (existingIndex === -1 || sortBy.value.length > 1) {
      sortBy.value = [{ key: columnKey, order: "asc" }];
    } else {
      const currentOrder = sortBy.value[0].order;
      if (currentOrder === "asc") {
        sortBy.value = [{ key: columnKey, order: "desc" }];
      } else {
        sortBy.value = [];
      }
    }
  }

  loadStudents();
};

const navigateToNew = () => {
  router.push({ name: "student-new" });
};

const editStudent = (id: string) => {
  router.push({ name: "student-edit", params: { id } });
};

const openDeleteDialog = (student: Student) => {
  studentToDelete.value = student;
  deleteDialog.value = true;
};

const confirmDelete = async () => {
  if (!studentToDelete.value) return;

  deleting.value = true;
  try {
    await studentService.delete(studentToDelete.value.id);
    await loadStudents();
    showMessage("Aluno excluído com sucesso", "success");
    deleteDialog.value = false;
  } catch (error) {
    showMessage("Erro ao excluir aluno", "error");
  } finally {
    deleting.value = false;
  }
};

const showMessage = (
  message: string,
  color: "success" | "error" = "success"
) => {
  snackbarMessage.value = message;
  snackbarColor.value = color;
  snackbar.value = true;
};

const formatCPF = (cpf: string): string => {
  if (cpf.includes(".")) return cpf;
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

const getInitials = (name: string): string => {
  if (!name) return "?";
  const names = name.split(" ");
  return names.length > 1
    ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
    : names[0].slice(0, 2).toUpperCase();
};

const getCustomSortIcon = (
  columnKey: string,
  sortBy: readonly any[]
): string => {
  const sortItem = sortBy.find((item: any) => item.key === columnKey);

  if (!sortItem) {
    return "mdi-menu-swap";
  }

  return sortItem.order === "asc" ? "mdi-menu-up" : "mdi-menu-down";
};

onMounted(() => {
  loadStudents();
});
</script>

<style scoped>
.custom-card {
  border: 1px solid rgba(27, 39, 49, 0.08);
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
}

.stats-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
}

.stats-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #ff203b 0%, #ff4d66 100%);
}

.stats-icon {
  animation: pulse 2s ease-in-out infinite;
}

.filter-card {
  background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
}

.table-card {
  background: #ffffff;
}

.custom-data-table {
  background: transparent !important;
}

.custom-data-table :deep(.v-data-table__th) {
  background-color: #f8f9fa !important;
  color: #1b2731 !important;
  font-weight: 600 !important;
  font-size: 0.875rem !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #ff203b !important;
  padding: 16px !important;
}

.custom-data-table :deep(.v-data-table__td) {
  padding: 16px !important;
  border-bottom: 1px solid rgba(27, 39, 49, 0.06) !important;
}

.custom-data-table :deep(.v-data-table__tr:hover) {
  background-color: rgba(255, 32, 59, 0.02) !important;
}

.sortable-header {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  transition: color 0.2s ease;
}

.sortable-header:hover {
  color: #ff203b !important;
}

.action-buttons {
  display: flex;
  gap: 4px;
  justify-content: center;
}

.action-btn {
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: scale(1.1);
}

.table-footer {
  background: linear-gradient(180deg, #fafafa 0%, #f8f9fa 100%);
  border-top: 2px solid rgba(255, 32, 59, 0.1);
}

.page-size-select {
  max-width: 100px;
}

.custom-pagination :deep(.v-pagination__item) {
  border-radius: 8px;
  font-weight: 600;
}

.custom-pagination :deep(.v-pagination__item--is-active) {
  background: linear-gradient(135deg, #ff203b 0%, #ff4d66 100%) !important;
}

.custom-pagination :deep(.v-pagination__item--is-active) button span {
  color: #ffffff;
}

.delete-info-box {
  background: linear-gradient(
    135deg,
    rgba(255, 32, 59, 0.03) 0%,
    rgba(255, 77, 102, 0.03) 100%
  );
  border: 1px solid rgba(255, 32, 59, 0.1);
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

.custom-field :deep(.v-field__outline) {
  border-width: 1.5px;
}

.custom-field:hover :deep(.v-field__outline) {
  border-color: rgba(255, 32, 59, 0.3);
}

.fade-in {
  animation: fadeIn 0.6s ease-out;
}

.fade-in-delayed {
  animation: fadeIn 0.8s ease-out 0.2s both;
}

.fade-in-more-delayed {
  animation: fadeIn 1s ease-out 0.4s both;
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

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@media (max-width: 960px) {
  .stats-card {
    margin-bottom: 16px;
  }

  .table-footer {
    flex-direction: column !important;
    gap: 16px;
  }

  .custom-pagination {
    order: 2;
  }
}
</style>
