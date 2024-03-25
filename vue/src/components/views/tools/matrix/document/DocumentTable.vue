<script setup lang="ts">
import { ref, watch } from "vue";
import { IChips } from "../../../../../interfaces/document/IChips";
// import { useI18n } from "vue-i18n";
import { IFileItem } from "../../../../../interfaces/document/IFileItem";
import { DocumentManager } from "../../../../../models/document/DocumentManager";
import { IDocumentEntity } from "../../../../../interfaces/document/IDocumentEntity";
import { DocumentEntity } from "../../../../../models/document/DocumentEntity";

import CrudChipTable from "../../../../../components/tools/CrudChipTable.vue";

const emit = defineEmits(["table"]);

// dictionary
// const { t } = useI18n();

// const tableAdd = computed(() => t("tools.matrix.documents.add_button"));
// const tableItem = computed<string>(() => t("tools.documents.name"));

const props = defineProps<{
  chips: IChips;
}>();

const chips = ref<IChips>(props.chips);

watch(
  () => props.chips,
  async (newChips) => {
    chips.value = newChips;
  },
  { deep: true }
);

const headers: any = [
  { title: "Name", align: "start", key: "name" },
  { title: "Description", key: "description" },
  { title: "Languages (files)", key: "languages", sortable: false },
  { title: "Revision", key: "revision", sortable: false },
  { title: "Actions", key: "actions", sortable: false },
];

const handleSaveData = (data: any) => {
  const base = new DocumentEntity();
  base.ref = data.ref;
  base.name = data.name;
  base.description = data.description;
  base.revision = data.revision;

  handleReqData(base, data.files, chips.value);
};

const manager = new DocumentManager();

const reqData = ref<any>(null);

const handleReqData = (base: IDocumentEntity, files: Array<IFileItem>, chips: IChips): void => {
  const formData: any = new FormData();

  formData.append("base", JSON.stringify(base));
  formData.append("files", JSON.stringify(files));
  formData.append("target", JSON.stringify(chips));

  interface Langs {
    langs: Array<string>;
  }

  const filesLangs: Array<Langs> = [];

  files.forEach((file: IFileItem) => {
    formData.append(`file_${file.id}`, file.file?.at(0));

    filesLangs.push({
      langs: file.langs as Array<string>,
    });
  });

  formData.append(`files_langs`, JSON.stringify(filesLangs));

  reqData.value = formData;
};
</script>

<template>
  <crud-chip-table
    variant="documents"
    :headers="headers"
    :searchByKeys="['name', 'description']"
    :sortBy="[{ key: 'name', order: 'asc' }]"
    toolbarTitle="Documents"
    :manager="manager"
    :chips="props.chips"
    langs-variant="list"
    @save-data="handleSaveData"
    :req-data="reqData"
  >
  </crud-chip-table>
</template>
