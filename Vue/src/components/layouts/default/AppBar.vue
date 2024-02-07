<script setup lang="ts">
import { defineEmits } from "vue";

//
const emits = defineEmits(["toggle-drawer"]);

const toggleDrawer = () => emits("toggle-drawer");
</script>

<template>
  <v-app-bar :elevation="2">
    <v-app-bar-nav-icon @click="toggleDrawer" />
    <v-app-bar-title>Intranet</v-app-bar-title>
  </v-app-bar>
</template>
