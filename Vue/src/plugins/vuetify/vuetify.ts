// Vuetify

import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

import { createVuetify } from "vuetify";

import { components } from "./components.ts";
import { directives } from "./directives.ts";

const vuetify = createVuetify({
  components,
  directives,
});

export { vuetify };
