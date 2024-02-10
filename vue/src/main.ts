// @ts-check
import "./assets/style.scss";
import { createApp } from "vue";
import App from "./App.vue";

import { vuetify } from "./plugins/vuetify/vuetify.ts";
import { pinia } from "./plugins/pinia/pinia.ts";
import { router } from "./plugins/router/router.ts";

const app = createApp(App);

app.use(vuetify);
app.use(pinia);
app.use(router);

app.mount("#app");
