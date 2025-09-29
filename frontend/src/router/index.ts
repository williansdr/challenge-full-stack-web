import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import SignInView from "@/views/SignInView.vue";
import SignUpView from "@/views/SignUpView.vue";
import StudentsView from "@/views/StudentsView.vue";
import StudentEditView from "@/views/StudentEditView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/signin",
  },
  {
    path: "/signin",
    name: "signin",
    component: SignInView,
    meta: {
      title: "Login",
      requiresAuth: false,
      requiresGuest: true, // Only accessible when not authenticated
    },
  },
  {
    path: "/signup",
    name: "signup",
    component: SignUpView,
    meta: {
      title: "Cadastro",
      requiresAuth: false,
      requiresGuest: true,
    },
  },
  {
    path: "/alunos",
    name: "students",
    component: StudentsView,
    meta: {
      title: "Consulta de Alunos",
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: "/alunos/novo",
    name: "student-new",
    component: StudentEditView,
    meta: {
      title: "Cadastrar Aluno",
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: "/alunos/:id/editar",
    name: "student-edit",
    component: StudentEditView,
    meta: {
      title: "Editar Aluno",
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, _from, next) => {
  const title = to.meta.title as string;
  document.title = title || "Sistema de Matrículas";

  const authStore = useAuthStore();
  const requiresAuth = to.meta.requiresAuth;
  const requiresAdmin = to.meta.requiresAdmin;
  const requiresGuest = to.meta.requiresGuest;

  // If route requires guest (signin/signup) and user is authenticated
  if (requiresGuest && authStore.isAuthenticated.value) {
    return next({ name: "students" });
  }

  // If route requires authentication and user is not authenticated
  if (requiresAuth && !authStore.isAuthenticated.value) {
    return next({ name: "signin" });
  }

  // If route requires admin and user is not admin
  if (requiresAdmin && !authStore.isAdmin.value) {
    return next({ name: "signin" });
  }

  next();
});

export default router;
