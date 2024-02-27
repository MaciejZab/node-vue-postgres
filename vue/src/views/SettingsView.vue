<script setup lang="ts">
import { ref, watch } from "vue";
import { useTheme } from "vuetify";
import { useSettingsStore } from "../stores/settingsStore";
// import ApplicationWindow from "../components/views/settings/ApplicationWindow.vue";

const settingsStore = useSettingsStore();
const settingsInfo = settingsStore.info();
const themeFromSettings = settingsInfo ? settingsInfo.theme : "light";

const tab = ref(1);
const theme = ref(themeFromSettings);
const themeInstance = useTheme();

watch(theme, () => {
  themeInstance.global.name.value = theme.value;
});
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="bg-surface text-onSurface mt-3">
          <v-tabs v-model="tab" class="" align-tabs="center">
            <v-tab :value="1">Application</v-tab>
            <v-tab :value="2">User</v-tab>
          </v-tabs>
          <v-window v-model="tab">
            <v-window-item v-for="n in 2" :key="n" :value="n">
              <v-container fluid v-if="tab === 1">
                <v-row>
                  <v-col md="4">
                    <!-- <application-window /> -->
                    <v-select v-model="theme" label="Theme" :items="['light', 'dark']"></v-select>
                  </v-col>
                </v-row>
              </v-container>
              <v-container fluid v-if="tab === 2">
                <v-row>
                  <v-col md="4">
                    <!-- <v-card
                      title="Card title"
                      text="Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin mattis lacinia justo. Cras pede libero, dapibus nec, pretium sit amet, tempor quis. In laoreet, magna id viverra tincidunt, sem odio bibendum justo, vel imperdiet sapien wisi sed libero."
                    >
                      <v-card-actions>
                        <v-btn>Click me</v-btn>
                      </v-card-actions>
                    </v-card>
                    <v-select
                      v-model="theme"
                      label="Theme"
                      :items="['different', 'dark']"
                    ></v-select> -->
                  </v-col>
                </v-row>
              </v-container>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style></style>
