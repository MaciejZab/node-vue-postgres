<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { ResponseStatus } from "../../../../../models/common/ResponseStatus";
import { IChips } from "../../../../../interfaces/document/IChips";
import Stepper from "./Stepper.vue";
import tableDialog from "../../../../../components/tools/tableDialog.vue";
// import { useI18n } from "vue-i18n";
import { IFileItem } from "../../../../../interfaces/document/IFileItem";
import { DocumentManager } from "../../../../../models/document/DocumentManager";
import { IDocumentEntity } from "../../../../../interfaces/document/IDocumentEntity";
import { DocumentEntity } from "../../../../../models/document/DocumentEntity";
import { Chips } from "../../../../../models/document/Chips";

const emit = defineEmits(["table"]);

const manager = new DocumentManager();
const documents = ref<Array<IDocumentEntity>>([]);

const chips = ref<IChips>(new Chips());

(async () => {
  try {
    documents.value = await manager.get(chips.value);
  } catch (error) {
    console.log(error);
  }
})();

// dictionary
// const { t } = useI18n();

// const tableAdd = computed(() => t("tools.matrix.documents.add_button"));
// const tableItem = computed<string>(() => t("tools.documents.name"));

const props = defineProps<{
  chips: IChips | undefined;
}>();

const tableAddDisabled = ref<boolean>(true);

watch(
  () => [props.chips?.department, props.chips?.category, props.chips?.subcategory],
  async ([dep, cat, sub]) => {
    if (sub) tableAddDisabled.value = false;
    else tableAddDisabled.value = true;

    chips.value.department = dep !== undefined ? dep : "";
    chips.value.category = cat !== undefined ? cat : "";
    chips.value.subcategory = sub !== undefined ? sub : "";

    documents.value = await manager.get(chips.value);
  }
);

const responseStatus = ref<ResponseStatus | null>(null);

const headers: any = [
  { title: "Name", align: "start", key: "name" },
  { title: "Description", key: "description" },
  { title: "Languages (files)", key: "languages", sortable: false },
  { title: "Revision", key: "revision", sortable: false },
  { title: "Actions", key: "actions", sortable: false },
];

const search = ref<string>("");

const filteredDocuments = computed(() => {
  return documents.value.filter((document) => {
    const name = document.name.toLowerCase();
    const description = document.description.toLowerCase();
    const searchTerm = search.value.toLowerCase();

    return name.includes(searchTerm) || description.includes(searchTerm);
  });
});

const dialog = ref<boolean>(false);
const dialogLoading = ref<boolean>(false);
const dialogDelete = ref<boolean>(false);
const dialogDeleteLoading = ref<boolean>(false);
const editedIndex = ref<number>(-1);

const editedItem = ref<IDocumentEntity>(new DocumentEntity());
const defaultItem: IDocumentEntity = new DocumentEntity();

const docFormData = ref<IDocumentEntity | undefined>(undefined);
const docFormFiles = ref<Array<IFileItem> | undefined>(undefined);
const newDocData = ref<any>(undefined);

const handleNewDocData = (data: any) => (newDocData.value = data);

const verified = ref<boolean>(false);
const handleVerified = (v: boolean) => {
  verified.value = v;
};

watch(
  newDocData,
  (nV: any) => {
    const v = nV.value;
    const data = new DocumentEntity();
    data.name = v.name;
    data.description = v.description;
    data.revision = v.revision;

    docFormData.value = data;
    docFormFiles.value = v.files;
  },
  { deep: true }
);

// FORM FUNCTIONS

const deleteItem = async (item: IDocumentEntity) => {
  editedIndex.value = documents.value.indexOf(item);
  editedItem.value = { ...item };
  dialogDelete.value = true;
};

const closeDelete = async () => {
  dialogDelete.value = false;

  nextTick(() => {
    editedItem.value = { ...defaultItem };
    editedIndex.value = -1;
  });
};

const deleteItemConfirm = async () => {
  const itemId: number = editedItem.value.id;

  dialogDeleteLoading.value = true;
  try {
    await manager.delete(itemId);
    documents.value = await manager.get(chips.value);
  } catch (error: any) {
    console.log(error);
    responseStatus.value = new ResponseStatus({
      code: error.response.status,
      message: error.response.data.statusMessage,
    });
  }

  dialogDeleteLoading.value = false;
  closeDelete();
};

const editItem = (item: IDocumentEntity) => {
  editedIndex.value = documents.value.indexOf(item);
  editedItem.value = { ...item };
  dialog.value = true;
};

const close = () => {
  dialog.value = false;

  nextTick(() => {
    editedItem.value = { ...defaultItem };
    editedIndex.value = -1;
  });
};

const save = async () => {
  const formData: any = new FormData();
  const formDataValue = docFormData.value;

  const base = new DocumentEntity();
  base.ref = editedItem.value.ref;
  base.name = formDataValue?.name as string;
  base.description = formDataValue?.description as string;
  base.revision = formDataValue?.revision as number;

  formData.append("base", JSON.stringify(base));
  formData.append("chips", JSON.stringify(chips.value));

  interface Langs {
    langs: Array<string>;
  }

  const filesLangs: Array<Langs> = [];

  docFormFiles.value?.forEach((file: IFileItem) => {
    formData.append(`file_${file.id}`, file.file?.at(0));

    filesLangs.push({
      langs: file.langs as Array<string>,
    });
  });

  formData.append(`files_langs`, JSON.stringify(filesLangs));

  dialogLoading.value = true;
  if (editedIndex.value > -1) {
    try {
      await manager.put(formData);
      documents.value = await manager.get(chips.value);
    } catch (error: any) {
      console.log(error);
      responseStatus.value = new ResponseStatus({
        code: error.response.status,
        message: error.response.data.statusMessage,
      });
    }
  } else {
    await manager.post(formData);
    documents.value = await manager.get(chips.value);
    try {
    } catch (error: any) {
      console.log(error);
      responseStatus.value = new ResponseStatus({
        code: error.response.status,
        message: error.response.data.statusMessage,
      });
    }
  }

  dialogLoading.value = false;
  close();
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

const languages = (item: IDocumentEntity) => {
  return item.languages.map((lang: string) => ({
    title: lang
      .split("_")
      .map((code: string) => (LangDictionary as LangDictionaryStringMap)[code])
      .join(", "),
  }));
};
</script>

<template>
  <v-card class="rounded-xl elevation-2">
    <v-data-table
      :headers="headers"
      :items="filteredDocuments"
      :sort-by="[{ key: 'name', order: 'asc' }]"
      class="bg-surface-2"
    >
      <template v-slot:top>
        <v-toolbar flat density="compact" class="bg-surface-2 pa-n4">
          <v-toolbar-title class="ml-0">{{ `Documents` }}</v-toolbar-title>
          <v-text-field
            v-model="search"
            label="Search"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            color="primary"
            hide-details
            single-line
            :rounded="true"
          ></v-text-field>
          <v-divider class="mx-4" inset vertical></v-divider>

          <table-dialog
            v-model="dialog"
            variant="Save"
            :index="editedIndex"
            :loading="dialogLoading"
            :disable="tableAddDisabled"
            :confirm-disable="verified"
            @close="close"
            @confirm="save"
          >
            <template v-slot>
              <stepper
                @verified="handleVerified"
                @new-doc-data="handleNewDocData"
                :edited-item="editedItem"
              ></stepper>
            </template>
          </table-dialog>

          <table-dialog
            v-model="dialogDelete"
            variant="Delete"
            delete-t-msg="deleteDocumentConfirmation"
            :index="editedIndex"
            :loading="dialogDeleteLoading"
            @close="closeDelete"
            @confirm="deleteItemConfirm"
          >
          </table-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.languages="{ item }">
        <v-list-item class="pl-0" density="compact" v-for="(lang, i) in languages(item)" :key="i">
          <v-list-item-title class="text-body-2">
            {{ `${i + 1}) ${lang.title}` }}</v-list-item-title
          >
        </v-list-item>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn
          variant="tonal"
          color="primary"
          size="small"
          @click="editItem(item)"
          icon="mdi-pencil"
          class="ma-2"
        />

        <v-btn
          variant="tonal"
          color="primary"
          size="small"
          @click="deleteItem(item)"
          icon="mdi-delete"
          class="ma-2"
        />
      </template>
    </v-data-table>
  </v-card>
</template>
