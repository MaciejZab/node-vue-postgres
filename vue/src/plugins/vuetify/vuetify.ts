// Vuetify

import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

import { createVuetify, ThemeDefinition } from "vuetify";

import { components } from "./components.ts";
import { directives } from "./directives.ts";

const lightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary: "#375ea9", // Reconext Blue
    primaryVariant: "#a9bbe2", // Reconext Light Blue
    onPrimary: "#ffffff", // White

    secondary: "#45ae52", // Reconext Green
    secondaryVariant: "#c6e0bc", // Reconext Light Green
    onSecondary: "#000000", // Black

    background: "#ffffff", // White
    onBackground: "#000000", // Black

    surface: "#ffffff", // White
    onSurface: "#000000", // Black

    error: "#B00020",
  },
};

const darkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: "#375ea9", // Reconext Blue
    primaryVariant: "#a9bbe2", // Reconext Light Blue
    onPrimary: "#ffffff", // White

    secondary: "#45ae52", // Reconext Green
    secondaryVariant: "#c6e0bc", // Reconext Light Green
    onSecondary: "#000000", // Black

    background: "#2c2e35", // Dark Grey
    onBackground: "#ffffff", // White

    surface: "#2c2e35", // Dark Grey
    onSurface: "#ffffff", // White

    error: "#B00020",
  },
};

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "lightTheme",
    themes: {
      lightTheme,
      darkTheme,
    },
  },
});

export { vuetify };
