<script setup lang="ts">
import { ref, watch } from "vue";
import { Editor } from "./ckeditor";
import { useEditorStore } from "../../stores/editorStore";
import { nodeConfig } from "../../config/env";
import { Endpoints } from "../../config/Endpoints";

const emit = defineEmits(["ref"]);

const editor = Editor;

const editorData = ref<string>(`<div class="ck-override-vuetify-styles"></div><div></div>`);
const editorStore = useEditorStore();
const eRef = editorStore.getRef();

const editorConfig = {
  ...editor.defaultConfig,
  simpleUpload: {
    uploadUrl: `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.News}`,
    headers: {
      ckeditor: "true",
      ref: eRef,
    },
  },
};

emit("ref", eRef);

// div.ck-override-vuetify-styles is the preceding styling element for ck output - see ckeditor.scss
watch(editorData, (newV) => {
  editorStore.save(`<div class="ck-override-vuetify-styles"></div><div>${newV}</div>`);
});
</script>

<template>
  <ckeditor
    class="ck-override-vuetify-styles"
    :editor="editor"
    :config="editorConfig"
    v-model="editorData"
  ></ckeditor>
</template>

<style>
.ck-editor__editable {
  min-height: 360px !important;
}
.ck-body-wrapper {
  position: relative;
  z-index: 2401 !important;
}
</style>