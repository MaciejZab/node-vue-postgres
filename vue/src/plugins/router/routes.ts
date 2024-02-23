// 1. Define route components.

import DefaultLayout from "../../layouts/DefaultLayout.vue";
import HomeView from "../../views/HomeView.vue";
import AuthView from "../../views/AuthView.vue";
import SettingsView from "../../views/SettingsView.vue";

// 2. Define routes
const routes = [
  {
    path: "/",
    name: "auth",
    component: AuthView,
    meta: {
      read: false,
      write: false,
      control: false,
    },
  },
  {
    path: "/settings",
    name: "settings",
    component: DefaultLayout,
    children: [
      {
        path: "",
        name: "settingsMenu",
        component: SettingsView,
        meta: {
          read: true,
          write: false,
          control: false,
        },
      },
    ],
  },
  {
    path: "/pages",
    name: "pages",
    component: DefaultLayout,
    children: [
      {
        path: "",
        name: "redirectHome",
        redirect: { name: "home" },
        meta: {
          read: true,
          write: false,
          control: false,
        },
      },
      {
        path: "home",
        name: "home",
        component: HomeView,
        meta: {
          read: true,
          write: false,
          control: false,
        },
      },
    ],
  },
];

export { routes };
