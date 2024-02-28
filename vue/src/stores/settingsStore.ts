import { defineStore } from "pinia";
import { ref } from "vue";
import { ISettings } from "../interfaces/user/ISettings";

export const useSettingsStore = defineStore("settings", () => {
  const settings = ref<ISettings>({
    id: null,
    theme: "light",
  });

  const set = (data: ISettings): boolean => {
    try {
      settings.value.id = data.id;
      settings.value.theme = data.theme;

      localStorage.setItem("settings", JSON.stringify(settings.value));
    } catch (error) {
      return false;
    }

    return true;
  };

  const info = (): ISettings => {
    try {
      const json: string | null = localStorage.getItem("settings");
      if (!json) throw new Error("No settings data found in localStorage");

      const settings: ISettings = JSON.parse(json);
      return settings;
    } catch (error) {
      console.error("Error retrieving settings info:", error);
      return settings.value; // default settings
    }
  };

  return { set, info };
});
