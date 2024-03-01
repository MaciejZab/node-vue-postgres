<script setup lang="ts">
import DefaultNavDrawer from "./../components/layouts/default/NavigationDrawer.vue";
import DefaultAppBar from "./../components/layouts/default/AppBar.vue";
import DefaultBreadcrumbs from "../components/layouts/default/Breadcrumbs.vue";
import DefaultFooter from "../components/layouts/default/Footer.vue";

import { ref } from "vue";

const drawerVisible = ref<boolean>(false);

const hideDrawer = (event: MouseEvent | null) => {
  if (event && event.target instanceof Element && !event.target.closest(".v-toolbar .v-btn")) {
    drawerVisible.value = false;
  }
};

const toggleDrawer = () => {
  drawerVisible.value = !drawerVisible.value;
};
</script>

<template>
  <v-sheet class="d-flex flex-column fill-height" @click="hideDrawer">
    <default-app-bar @toggle-drawer="toggleDrawer" />
    <default-nav-drawer :drawer-visible="drawerVisible" />

    <v-main class="bg-background">
      <default-breadcrumbs />
      <router-view></router-view>
    </v-main>

    <default-footer />
  </v-sheet>
</template>
