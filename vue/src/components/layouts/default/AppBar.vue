<script setup lang="ts">


const emits = defineEmits(["toggle-drawer"]);

const toggleDrawer = () => emits("toggle-drawer");
</script>

<template>
  <v-app-bar :elevation="2" class="bg-primary">
    <v-app-bar-nav-icon @click="toggleDrawer" />
    <v-app-bar-title class="text-onPrimary">Intranet</v-app-bar-title>
  </v-app-bar>
</template>
