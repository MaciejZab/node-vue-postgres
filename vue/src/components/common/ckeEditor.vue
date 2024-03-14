<script setup lang="ts">
// https://ckeditor.com/docs/ckeditor5/latest/installation/getting-started/predefined-builds.html#installation-example-5
import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import { onMounted, ref } from "vue";

const editor = ref<HTMLDivElement | null>(null);

onMounted(() => {
  if (editor.value) {
    DecoupledEditor.create(editor.value)
      .then((editor: any) => {
        const toolbarContainer = document.querySelector("#toolbar-container");

        if (toolbarContainer) {
          toolbarContainer.appendChild(editor.ui.view.toolbar.element);
        } else {
          console.error("Toolbar container not found.");
        }
      })
      .catch((error: Error) => {
        console.error(error);
      });
  }
});
</script>

<template>
  <div id="toolbar-container"></div>
  <div ref="editor" class="w-100 h-100"></div>
</template>
