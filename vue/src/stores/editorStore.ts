import { defineStore } from "pinia";
import { ref } from "vue";

export const useEditorStore = defineStore("editor", () => {
  const editor = ref<string>("");

  const save = (value: string) => {
    editor.value = value;
  };

  const get = () => {
    console.log(editor.value);
  };

  return { save, get };
});
