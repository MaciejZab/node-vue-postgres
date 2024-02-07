<script setup lang="ts">
import NavDrawer from "./../components/layouts/default/NavigationDrawer.vue";
import AppBar from "./../components/layouts/default/AppBar.vue";

import { ref } from "vue";

const drawerVisible = ref<boolean>(false);

const toggleDrawer = () => (drawerVisible.value = !drawerVisible.value);
</script>

<template>
  <AppBar @toggle-drawer="toggleDrawer" />
  <NavDrawer :drawer-visible="drawerVisible" />

  <v-main>
    <v-container fluid>
      <router-view></router-view>
    </v-container>
  </v-main>

  <v-footer app>
    <!-- -->
  </v-footer>
</template>
