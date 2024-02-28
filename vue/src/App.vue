<script setup lang="ts">
import { onMounted } from "vue";
import { useTheme } from "vuetify";
import { useSettingsStore } from "./stores/settingsStore";
import { ISettings } from "./interfaces/user/ISettings";

const useT = useTheme();

const settingsStore = useSettingsStore();
const settings: ISettings = settingsStore.info();

onMounted(() => {
  useT.global.name.value = settings.theme;
});
</script>

<template>
  <v-app class="bg-background font-size-handler">
    <!-- vue-router -->
    <router-view></router-view>
  </v-app>
</template>

<style scoped></style>
