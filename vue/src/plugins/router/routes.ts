// 1. Define route components.

import DefaultLayout from "../../layouts/DefaultLayout.vue";
import HomeView from "../../views/HomeView.vue";
import AuthView from "../../views/AuthView.vue";
import SettingsView from "../../views/SettingsView.vue";
import ToolsView from "../../views/ToolsView.vue";
import DocumentsView from "../../views/tools/DocumentsView.vue";
import MatrixView from "../../views/tools/MatrixView.vue";

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
      breadcrumbs: {
        include: false,
        parent: "",
        name: "",
        path: "",
      },
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
          breadcrumbs: {
            include: true,
            parent: "pages",
            name: "home",
            path: "/pages/home",
          },
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
          breadcrumbs: {
            include: false,
            parent: "",
            name: "",
            path: "",
          },
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
          breadcrumbs: {
            include: true,
            parent: "pages",
            name: "settings",
            path: "",
          },
        },
      },
      {
        path: "tools",
        name: "tools",
        component: ToolsView,
        meta: {
          read: true,
          write: false,
          control: false,
          breadcrumbs: {
            include: true,
            parent: "pages",
            name: "tools",
            path: "",
          },
        },
      },
    ],
  },
  {
    path: "/tool",
    name: "tool",
    component: DefaultLayout,
    children: [
      {
        path: "",
        name: "redirectDocuments",
        redirect: { name: "documents" },
        meta: {
          read: true,
          write: false,
          control: false,
          breadcrumbs: {
            include: true,
            parent: "pages",
            name: "tools",
            path: "/pages/tools",
          },
        },
      },
      {
        path: "documents",
        name: "documents",
        component: DocumentsView,
        meta: {
          reaD: true,
          write: false,
          control: false,
          breadcrumbs: {
            include: true,
            parent: "tool",
            name: "documents",
            path: "",
          },
        },
      },
      {
        path: "matrix",
        name: "matrix",
        component: MatrixView,
        meta: {
          reaD: true,
          write: false,
          control: false,
          breadcrumbs: {
            include: true,
            parent: "tool",
            name: "matrix",
            path: "",
          },
        },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notFound",
    redirect: { name: "home" },
  },
];

export { routes };
