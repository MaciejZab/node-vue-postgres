<script setup lang="ts">
import { ref, watch } from "vue";
import axios from "axios";
import { useTheme } from "vuetify";
import { nodeConfig } from "../../../config/env";
import { endpoints } from "../../../config/endpoints";
import { ISettings } from "../../../interfaces/user/ISettings";
import { Settings } from "../../../models/user/Settings";
import { IResponseStatus } from "../../../interfaces/common/IResponseStatus";
import { ResponseStatus } from "../../../models/common/ResponseStatus";
import { useSettingsStore } from "../../../stores/settingsStore";

const useT = useTheme();
const settingsStore = useSettingsStore();
const settings: ISettings = settingsStore.info();

const theme = ref<string>(settings.theme);
const responseStatus = ref<IResponseStatus | null>(null);
const emit = defineEmits(["response-status"]);

watch(theme, () => {
  settings.theme = theme.value;
  useT.global.name.value = settings.theme;
  settingsStore.set(settings);

  const reqUrl: string = `${nodeConfig.origin}:${nodeConfig.port}${endpoints.userSettingsThemePath}`;
  const reqData: Partial<ISettings> = new Settings(settings);

  axios
    .post(reqUrl, reqData)
    .then(function (response) {
      responseStatus.value = new ResponseStatus({
        code: response.status,
        message: response.data.message,
      });
      emit("response-status", responseStatus.value);
    })
    .catch(function (error) {
      responseStatus.value = new ResponseStatus({
        code: error.response.status,
        message: error.response.data.message,
      });
      emit("response-status", responseStatus.value);
    });
});
</script>

<template>
  <v-select v-model="theme" label="Theme" :items="['light', 'dark']"></v-select>
  <v-select label="Language" :items="['Polish', 'English', 'Ukrainian']" disabled></v-select>
</template>
