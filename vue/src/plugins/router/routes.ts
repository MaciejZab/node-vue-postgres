// 1. Define route components.

import DefaultLayout from "../../layouts/DefaultLayout.vue";
import HomeView from "../../views/HomeView.vue";
import AuthView from "../../views/AuthView.vue";
import SettingsView from "../../views/SettingsView.vue";
import ToolsView from "../../views/ToolsView.vue";

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
      {
        path: "settings",
        name: "settings",
        component: SettingsView,
        meta: {
          read: true,
          write: false,
          control: false,
        },
      },
      {
        path: "tools",
        name: "tools",
        component: ToolsView,
        meta: {
          read: true,
          write: true,
          control: false,
        },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notFound",
    redirect: { name: "home" }, // Redirect to home page or any other page you want
  },
];

export { routes };
