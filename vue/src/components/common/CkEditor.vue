<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const initializeEditor = () => {
  const editorElement = document.querySelector("#editor") as HTMLElement;
  if (!editorElement) {
    console.error("Editor element not found.");
    return;
  }
  ClassicEditor.create(editorElement, {
    toolbar: {
      items: [
        "undo",
        "redo",
        "|",
        "heading",
        "|",
        "fontfamily",
        "fontsize",
        "fontColor",
        "fontBackgroundColor",
        "|",
        "bold",
        "italic",
        "strikethrough",
        "subscript",
        "superscript",
        "code",
        "|",
        "link",
        "uploadImage",
        "blockQuote",
        "codeBlock",
        "|",
        "alignment",
        "|",
        "bulletedList",
        "numberedList",
        "todoList",
        "outdent",
        "indent",
      ],
      shouldNotGroupWhenFull: true,
    },
  })
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

<style>
body {
  --ck-z-default: 100; /* Default CKEditor z-index */
  --ck-z-modal: calc(var(--ck-z-default) + 999); /* Higher z-index for CKEditor modal */
}
</style>
