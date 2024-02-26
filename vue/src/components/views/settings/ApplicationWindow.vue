<script setup lang="ts">
import { ref } from "vue";

const themeDialog = ref<boolean>(false);
const toggleDialog = () => (themeDialog.value = !themeDialog.value);
</script>

<template>
  <v-btn @click="toggleDialog"> Open Dialog </v-btn>
  <v-dialog v-model="themeDialog" width="auto">
    <v-card
      prepend-icon="mdi-theme-light-dark"
      max-width="300"
      title="Change theme"
      text="Your application will relaunch automatically after the update is complete."
    >
      <v-btn class="ms-auto" text="Ok" @click="toggleDialog"></v-btn>
    </v-card>
  </v-dialog>
</template>
