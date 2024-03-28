<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { IChips } from "../../../../../interfaces/document/IChips";
// import { useI18n } from "vue-i18n";
import { IFileItem } from "../../../../../interfaces/document/IFileItem";
import { DocumentManager } from "../../../../../models/document/DocumentManager";
import { IDocumentEntity } from "../../../../../interfaces/document/IDocumentEntity";
import { DocumentEntity } from "../../../../../models/document/DocumentEntity";
import CrudTable from "../../../../../components/tools/CrudTable.vue";
import Stepper from "./Stepper.vue";

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
  { title: "Type", align: "start", key: "type" },
  { title: "Description", key: "description" },
  { title: "Languages (files)", key: "custom", sortable: false },
  { title: "Revision", key: "revision", sortable: false },
  { title: "Actions", key: "actions", sortable: false },
];

const handleSaveData = (data: any) => {
  const base = new DocumentEntity();
  base.ref = data.ref;
  base.type = data.type;
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

enum LangDictionary {
  en = "English",
  pl = "Polish",
  ua = "Ukrainian",
}

// Type alias mimicking the enum with string-based access
type LangDictionaryStringMap = {
  [key: string]: LangDictionary[keyof LangDictionary];
};

const languages = (item: any) => {
  return item?.languages.map((lang: string) => ({
    title: lang
      .split("_")
      .map((code: string) => (LangDictionary as LangDictionaryStringMap)[code])
      .join(", "),
  }));
};

const disableAdd = computed(() => {
  return !!!chips.value.subcategoryName;
});
</script>

<template>
  <crud-table
    :headers="headers"
    :sortBy="[{ key: 'name', order: 'asc' }]"
    :searchBy="['name', 'type', 'description']"
    toolbarTitle="Documents"
    :manager="manager"
    @save-data="handleSaveData"
    :req-data="reqData"
    :disableAdd="disableAdd"
    :chips="props.chips"
    :tableAdd="true"
    :tableDelete="true"
    :tableEdit="true"
    :tableDialogComponent="Stepper"
    :tableDialogComponentProps="{}"
  >
    <template v-slot:table-key-slot="{ item }">
      <v-list-item class="pl-0" density="compact" v-for="(lang, i) in languages(item)" :key="i">
        <v-list-item-title class="text-body-2"> {{ `${i + 1}) ${lang.title}` }}</v-list-item-title>
      </v-list-item>
    </template>
  </crud-table>
</template>
