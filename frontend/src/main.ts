import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { useAuthStore } from "./stores/authStore";

const app = createApp(App);

app.use(router);
app.use(vuetify);

// Initialize auth store
const authStore = useAuthStore();
authStore.initAuth();

app.mount("#app");
