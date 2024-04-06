<script setup lang="ts">
import { ref } from "vue";
import CrudTable from "../../../../components/tools/CrudTable.vue";
import { NewsManager } from "../../../../models/editor/NewsManager";
import NewsStepper from "./NewsStepper.vue";

const headers: any = [
  { title: "Title", align: "start", key: "title" },
  { title: "Subtitle", key: "subtitle" },
  { title: "Actions", key: "actions", sortable: false },
];

const reqData = ref<any>(null);

const handleSaveData = (data: any) => {
  if (!data) return;

  const base = {
    ref: data.ref,
    permission: data.permission,
    title: data.title,
    subtitle: data.subtitle,
    content: data.content,
  };
  const bgImage: File = data.bgImage.at(0);

  const formData: any = new FormData();
  formData.append("base", JSON.stringify(base));
  formData.append("bgImage", bgImage);

  reqData.value = formData;
};

const manager = new NewsManager();
</script>

<template>
  <crud-table
    :headers="headers"
    :sortBy="[{ key: 'title', order: 'asc' }]"
    :searchBy="['title', 'subtitle']"
    toolbarTitle="News"
    :manager="manager"
    @save-data="handleSaveData"
    :reqData="reqData"
    :tableAdd="true"
    :tableDelete="true"
    :tableEdit="true"
    :tableDialogComponent="NewsStepper"
    :tableDialogComponentProps="{}"
  >
  </crud-table>
</template>
