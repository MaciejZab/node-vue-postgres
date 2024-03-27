<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const initializeEditor = () => {
  const editorElement = document.querySelector("#editor") as HTMLElement;
  if (!editorElement) {
    console.error("Editor element not found.");
    return;
  }

  ClassicEditor.create(editorElement)
    .then((editor: any) => {
      console.log("Editor was initialized", editor);

      editor.model.document.on("change:data", () => {
        editorValue.value = editor.getData();
      });
    })
    .catch((err: any) => {
      console.error(err.stack);
    });
};

const editorValue = ref<string>("");

const emit = defineEmits(["save-data"]);

watch(editorValue, (value) => emit("save-data", value));

onMounted(() => {
  initializeEditor();
});
</script>

<template>
  <div id="editor"></div>
</template>
