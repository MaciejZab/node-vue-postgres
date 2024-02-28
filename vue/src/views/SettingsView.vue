<script setup lang="ts">
import { ComputedRef, computed, ref, watch } from "vue";
import { useSettingsStore } from "../stores/settingsStore";
import { nodeConfig } from "../config/env";
import { endpoints } from "../config/endpoints";
import axios from "axios";
import { ISettings } from "../interfaces/user/ISettings";
import { Settings } from "../models/user/Settings";
import { useTheme } from "vuetify";
// import ApplicationWindow from "../components/views/settings/ApplicationWindow.vue";
const useT = useTheme();

const settingsStore = useSettingsStore();
const settings: ISettings = settingsStore.info();

const tab = ref<number>(1);
const theme = ref<string>(settings.theme);

// Response error
interface settingsStatus {
  status: string;
  title: string;
  text: string;
}

const status = ref<settingsStatus | null>(null);
const isError: ComputedRef<boolean> = computed((): boolean => status.value!.status === "error");
const statusText: ComputedRef<string> = computed(
  (): string => `${status.value!.title}: ${status.value!.text}`
);

watch(theme, () => {
  settings.theme = theme.value;
  useT.global.name.value = settings.theme;
  settingsStore.set(settings);

  const reqUrl: string = `${nodeConfig.origin}:${nodeConfig.port}${endpoints.userSettingsThemePath}`;
  const reqData: Partial<ISettings> = new Settings(settings);

  axios
    .post(reqUrl, reqData)
    .then(function (response) {
      status.value = {
        status: "success",
        title: response.statusText,
        text: response.data.message,
      };
    })
    .catch(function (error) {
      console.log(error);

      switch (error.response.status) {
        case 404:
          status.value = {
            status: "error",
            title: error.response.statusText,
            text: error.response.data.message,
          };
          break;
        default:
          status.value = {
            status: "error",
            title: "Unknown error occurred",
            text: "Please try again later",
          };
          break;
      }
    });
});
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="bg-surface text-onSurface mt-3">
          <v-alert v-if="status && isError" type="error" :text="statusText"></v-alert>
          <v-alert v-else-if="status" type="success" :text="statusText"></v-alert>
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
