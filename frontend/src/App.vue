<template>
  <v-app>
    <v-app-bar
      v-if="isAuthenticated"
      color="white"
      elevation="0"
      height="80"
      class="custom-app-bar"
    >
      <v-container class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <img
            src="@/assets/logo-mais-a-educacao.svg"
            alt="+A Educação"
            height="45"
            class="mr-4 cursor-pointer"
            @click="$router.push('/alunos')"
          />
          <v-divider vertical class="mx-4 hide-on-mobile" />
          <span class="text-h6 text-secondary hide-on-mobile">
            Sistema de Matrículas
          </span>
        </div>

        <div class="d-flex align-center">
          <div class="text-right mr-4 hide-on-mobile">
            <div class="text-body-2 font-weight-bold text-secondary">
              {{ currentUser?.name || "Usuário" }}
            </div>
            <div class="text-caption text-brand-gray">
              {{ currentUser?.email || "" }}
            </div>
          </div>

          <v-menu offset-y rounded="lg">
            <template v-slot:activator="{ props }">
              <v-btn
                icon
                variant="flat"
                color="brand-light"
                size="large"
                v-bind="props"
                class="user-menu-btn"
              >
                <v-avatar size="40" color="primary">
                  <span class="text-white font-weight-bold">
                    {{ userInitials }}
                  </span>
                </v-avatar>
              </v-btn>
            </template>
            <v-list class="py-0" min-width="250">
              <v-list-item class="px-4 py-3 border-bottom">
                <v-list-item-title class="font-weight-bold">
                  {{ currentUser?.name || "Usuário" }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption">
                  {{ currentUser?.email || "" }}
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item class="px-4 py-2">
                <template v-slot:prepend>
                  <v-icon size="small" color="primary"
                    >mdi-shield-account</v-icon
                  >
                </template>
                <v-list-item-title class="text-body-2">
                  <strong> Perfil:</strong> {{ currentUser?.role || "N/A" }}
                </v-list-item-title>
              </v-list-item>
              <v-divider />
              <v-list-item @click="handleLogout" class="px-4 py-2 logout-item">
                <template v-slot:prepend>
                  <v-icon size="small" color="error">mdi-logout</v-icon>
                </template>
                <v-list-item-title class="text-body-2 text-error">
                  Sair do Sistema
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </v-container>
    </v-app-bar>

    <v-main :class="{ 'authenticated-main': isAuthenticated }">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>

    <v-footer v-if="isAuthenticated" color="secondary" class="custom-footer">
      <v-container>
        <v-row align="center" justify="space-between">
          <v-col cols="12" md="4">
            <img
              src="@/assets/logo-mais-a-educacao-negativo.svg"
              alt="+A Educação"
              height="35"
              class="mb-2"
            />
            <p class="text-caption text-white-50 mb-0">
              Transformando vidas através da educação
            </p>
          </v-col>
          <v-col cols="12" md="4" class="text-right">
            <p class="text-body-2 text-white mb-1">
              Sistema de Gestão Acadêmica
            </p>
            <p class="text-caption text-white-50">
              © {{ currentYear }} +A Educação. Todos os direitos reservados.
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>

    <v-snackbar
      v-model="globalSnackbar"
      :color="snackbarColor"
      rounded="lg"
      location="top right"
      :timeout="3000"
    >
      {{ snackbarMessage }}
      <template v-slot:actions>
        <v-btn variant="text" @click="globalSnackbar = false"> Fechar </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

const router = useRouter();
const authStore = useAuthStore();

const isAuthenticated = computed(() => authStore.isAuthenticated.value);
const currentUser = computed(() => authStore.currentUser.value);
const currentYear = computed(() => new Date().getFullYear());
const userInitials = computed(() => {
  if (!currentUser.value?.name) return "U";
  const names = currentUser.value.name.split(" ");
  return names.length > 1
    ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
    : names[0].slice(0, 2).toUpperCase();
});

const globalSnackbar = ref(false);
const snackbarMessage = ref("");
const snackbarColor = ref("success");

const handleLogout = () => {
  authStore.logout();
  router.push({ name: "signin" });
};
</script>

<style scoped>
@import "@/assets/global.css";

.custom-app-bar {
  border-bottom: 1px solid rgba(27, 39, 49, 0.08);
}

.authenticated-main {
  background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
  min-height: calc(100vh - 80px);
}

.custom-footer {
  padding: 40px 0;
  margin-top: auto;
}

.user-menu-btn {
  transition: all 0.3s ease;
}

.user-menu-btn:hover {
  transform: scale(1.05);
}

.logout-item:hover {
  background-color: rgba(255, 32, 59, 0.05);
}

.border-bottom {
  border-bottom: 1px solid rgba(27, 39, 49, 0.08);
}

.cursor-pointer {
  cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 960px) {
  .hide-on-mobile {
    display: none !important;
  }
}
</style>
