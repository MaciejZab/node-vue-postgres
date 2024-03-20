<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { ResponseStatus } from "../../../../../models/common/ResponseStatus";
import { Chips } from "../../../../../interfaces/document/Chips";
import { Level } from "../../../../../interfaces/document/Level";
import Stepper from "./Stepper.vue";
import { useI18n } from "vue-i18n";
import { FileItem } from "../../../../../interfaces/document/FileItem";
import { DocumentManager } from "../../../../../models/document/DocumentManager";
import { DocumentEntity } from "../../../../../interfaces/document/DocumentEntity";
import { DocumentForm } from "../../../../../interfaces/document/DocumentForm";

const emit = defineEmits(["table"]);

const level = ref<Level>(Level.Dep);
const emitTableChange = () => {
  emit("table", level.value);
};

const manager = new DocumentManager();
const documents = ref<Array<DocumentEntity>>([]);

const chips = ref<Chips>({
  department: "",
  category: "",
  subcategory: "",
});

(async () => {
  try {
    documents.value = await manager.get(chips.value);
  } catch (error) {
    console.log(error);
  }
})();

// const tableItem = ref<string>("Department");

const { t } = useI18n();

const tableAddDisabled = ref<boolean>(true);
const tableAdd = computed(() => t("tools.matrix.documents.add_button"));

const props = defineProps<{
  chips: Chips | undefined;
}>();

watch(
  () => [props.chips?.department, props.chips?.category, props.chips?.subcategory],
  async ([dep, cat, sub]) => {
    if (sub) tableAddDisabled.value = false;
    else if (cat) {
      level.value = Level.Sub;
      tableAddDisabled.value = true;
    } else if (dep) {
      level.value = Level.Cat;
      tableAddDisabled.value = true;
    } else {
      level.value = Level.Dep;
      tableAddDisabled.value = true;
    }

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
  { title: "Languages (files)", key: "languages" },
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
const dialogDelete = ref<boolean>(false);
const editedIndex = ref<number>(-1);

const editedItem = ref<Partial<DocumentEntity>>({
  name: "",
  description: "",
  competence: null,
  revision: 1,
});
const defaultItem: Partial<DocumentEntity> = {
  name: "",
  description: "",
  competence: null,
  revision: 1,
};

const formTitle = computed(() => (editedIndex.value === -1 ? `New Document` : `Edit Document`));

const docFormFiles = ref<Array<FileItem> | null>(null);
const docFormData = ref<DocumentForm | null>(null);
const newDocData = ref<any>(null);

const handleNewDocData = (data: any) => (newDocData.value = data);

const verified = ref<boolean>(false);
const handleVerified = (v: boolean) => {
  verified.value = v;
};

watch(
  newDocData,
  (nV: any) => {
    const v = nV.value;
    const docData: DocumentForm = {
      name: v.name,
      description: v.description,
      revision: v.revision,
      competence: v.competence,

      departmentName: chips.value.department,
      categoryName: chips.value.category,
      subcategoryName: chips.value.subcategory,
    };

    const docFiles: Array<FileItem> = v.files;

    docFormData.value = docData;
    docFormFiles.value = docFiles;
  },
  { deep: true }
);

// FORM FUNCTIONS

const editItem = (item: any) => {
  editedIndex.value = documents.value.indexOf(item);
  editedItem.value = { ...item };
  dialog.value = true;
};

const deleteItemConfirm = async () => {
  // const reqData: any = {
  //   name: editedItem.value.name,
  //   categoryName: category.value,
  //   departmentName: department.value,
  // };

  // const itemId: number = editedItem.value.id;

  try {
    // await manager.delete(itemId);
    // documents.value = await manager.value.get(reqData);
    emitTableChange();
  } catch (error: any) {
    console.log(error);
    responseStatus.value = new ResponseStatus({
      code: error.response.status,
      message: error.response.data.statusMessage,
    });
  }

  closeDelete();
};

const close = () => {
  dialog.value = false;
  nextTick(() => {
    editedItem.value = { ...defaultItem };
    editedIndex.value = -1;
  });
};

const closeDelete = async () => {
  dialogDelete.value = false;

  nextTick(() => {
    editedItem.value = { ...defaultItem };
    editedIndex.value = -1;
  });
};

const deleteItem = async (item: DocumentEntity) => {
  editedIndex.value = documents.value.indexOf(item);
  editedItem.value = { ...item };
  dialogDelete.value = true;
};

const save = async () => {
  const formData: any = new FormData();
  const formDataValue = docFormData.value;

  const base = {
    name: formDataValue?.name,
    description: formDataValue?.description,
    revision: formDataValue?.revision,
    departmentName: formDataValue?.departmentName,
    categoryName: formDataValue?.categoryName,
    subcategoryName: formDataValue?.subcategoryName,
  };

  formData.append("base", JSON.stringify(base));

  interface Langs {
    langs: Array<string>;
  }

  const filesLangs: Array<Langs> = [];

  docFormFiles.value?.forEach((file: FileItem) => {
    formData.append(`file_${file.id}`, file.file?.at(0));

    filesLangs.push({
      langs: file.langs as Array<string>,
    });
  });

  formData.append(`files_langs`, JSON.stringify(filesLangs));

  if (editedIndex.value > -1) {
    try {
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

const languages = (item: DocumentEntity) => {
  return item.languages.map((lang: string) => ({
    title: lang
      .split("_")
      .map((code: string) => (LangDictionary as LangDictionaryStringMap)[code])
      .join(", "),
  }));
};
</script>

<template>
  <v-card class="rounded-xl elevation-2 pa-4">
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
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ props }">
              <v-btn
                class="bg-primary text-on-primary mr-4 rounded-xl"
                height="40px"
                prepend-icon="mdi-plus"
                v-bind="props"
                :disabled="tableAddDisabled"
              >
                {{ tableAdd }}
              </v-btn>
            </template>
            <v-card class="rounded-xl">
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" class="pa-0">
                      <stepper
                        @verified="handleVerified"
                        @newDocData="handleNewDocData"
                        :editedItem="editedItem"
                      ></stepper>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="rounded-xl" color="primary" variant="outlined" @click="close">
                  Cancel
                </v-btn>
                <v-btn
                  class="bg-primary text-on-primary mr-4 rounded-xl"
                  @click="save"
                  :disabled="verified"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card class="bg-surface">
              <v-card-title class="text-h6">Are you sure you want to proceed?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="rounded-xl" color="primary" variant="text" @click="closeDelete">
                  Cancel
                </v-btn>
                <v-btn
                  class="bg-primary text-on-primary mr-4 rounded-xl"
                  @click="deleteItemConfirm"
                >
                  Ok
                </v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
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
          color="tertiary"
          size="small"
          @click="editItem(item)"
          icon="mdi-pencil"
          class="ma-2"
        />

        <v-btn
          variant="tonal"
          color="tertiary"
          size="small"
          @click="deleteItem(item)"
          icon="mdi-delete"
          class="ma-2"
        />
      </template>
    </v-data-table>
  </v-card>
</template>
