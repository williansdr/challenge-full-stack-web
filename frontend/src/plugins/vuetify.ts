import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import "@mdi/font/css/materialdesignicons.css";

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
  },
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        dark: false,
        colors: {
          primary: "#ff203b",
          secondary: "#1B2731",
          background: "#FFFFFF",
          surface: "#FFFFFF",
          error: "#B00020",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FB8C00",
          "brand-red": "#ff203b",
          "brand-dark": "#1B2731",
          "brand-gray": "#6c757d",
          "brand-light": "#f8f9fa",
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: "#ff203b",
          secondary: "#1B2731",
          background: "#1B2731",
          surface: "#263238",
        },
      },
    },
  },
  defaults: {
    VBtn: {
      rounded: "lg",
      elevation: 0,
      style: "text-transform: none; font-weight: 600; letter-spacing: 0.5px;",
    },
    VCard: {
      rounded: "lg",
      elevation: 0,
    },
    VTextField: {
      variant: "outlined",
      density: "comfortable",
      rounded: "lg",
    },
    VDataTable: {
      hover: true,
    },
  },
});
