<script setup lang="ts">
import { ref, computed, watchEffect, nextTick, watch } from "vue";
import { IChips } from "../../interfaces/document/IChips";
import { ResponseStatus } from "../../models/common/ResponseStatus";
import { Chips } from "../../models/document/Chips";
import tableDialog from "./tableDialog.vue";
import Stepper from "../views/tools/matrix/document/Stepper.vue";
import ChipInput from "../views/tools/matrix/department/ChipInput.vue";

const props = defineProps<{
  variant: "departments" | "documents";
  headers: any;
  searchByKeys: Array<string>;
  sortBy: Array<{ key: string; order?: boolean | "asc" | "desc" }>;
  toolbarTitle: string;
  manager: any;
  chips: IChips;
  langsVariant?: "list" | "select";
  reqData: any;
}>();

const variant = props.variant;

const headers = ref<any>(props.headers);
const items = ref<Array<any>>([]);

const filterKeys: Array<string> = props.searchByKeys;
const sortBy = props.sortBy;

const search = ref<string>("");
const filtered = computed(() => {
  if (search.value) {
    return items.value.filter((item) => {
      for (const key of filterKeys) {
        const value = item[key]?.toLowerCase();
        const searchTerm = search.value.toLowerCase();
        if (value && value.includes(searchTerm)) {
          return true;
        }
      }
      return false;
    });
  } else return items.value;
});

const toolbarTitle = ref<string>(props.toolbarTitle);

const manager = ref<any>(props.manager);
const item = ref<any>({ ...manager.value.new() });
const editedIndex = ref<number>(-1);
const editedItem = ref<any>({ ...item.value });

const dialog = ref<boolean>(false);
const dialogLoading = ref<boolean>(false);
const dialogDelete = ref<boolean>(false);
const dialogDeleteLoading = ref<boolean>(false);

const tableAdd = ref<boolean>(variant === "departments" ? false : true);
const verified = ref<boolean>(false);

const chips = ref<IChips>(new Chips());

(async () => {
  try {
    items.value = await manager.value.get(chips.value);
  } catch (error) {
    console.log(error);
  }
})();

const reqData = ref<any>(props.reqData);

watchEffect(() => {
  headers.value = props.headers;
  toolbarTitle.value = props.toolbarTitle;
  reqData.value = props.reqData;
});

watch(
  () => props.chips,
  async (newChips) => {
    chips.value = newChips;

    if (chips.value.subcategoryName || variant === "departments") tableAdd.value = false;
    else tableAdd.value = true;

    manager.value = props.manager;
    items.value = await manager.value.get(chips.value);
  },
  { deep: true }
);

const deleteItem = async (item: any) => {
  // console.log("delete", { ...item });
  editedIndex.value = items.value.indexOf(item);
  editedItem.value = { ...item };
  dialogDelete.value = true;
};
const editItem = (item: any) => {
  // console.log("edit", { ...item });
  editedIndex.value = items.value.indexOf(item);
  editedItem.value = { ...item };
  dialog.value = true;
};

const close = () => {
  dialog.value = false;
  dialogLoading.value = false;

  nextTick(() => {
    // console.log("close", { ...item.value });
    editedItem.value = { ...item.value };
    editedIndex.value = -1;
  });
};

const closeDelete = async () => {
  dialogDelete.value = false;

  nextTick(() => {
    editedItem.value = { ...item.value };
    editedIndex.value = -1;
  });
};

const responseStatus = ref<ResponseStatus | null>(null);

const deleteItemConfirm = async () => {
  const itemId: number = editedItem.value.id;

  dialogDeleteLoading.value = true;
  try {
    await manager.value.delete(itemId);
    if (variant === "departments") emit("emit-table-change");
    items.value = await manager.value.get(chips.value);
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

const emit = defineEmits(["save-data", "emit-table-change"]);

const save = async () => {
  try {
    const data: any = reqData.value;
    dialogLoading.value = true;

    if (editedIndex.value > -1) await manager.value.put(data);
    else await manager.value.post(data);
  } catch (error: any) {
    console.log(error);
    responseStatus.value = new ResponseStatus({
      code: error.response.status,
      message: error.response.data.statusMessage,
    });
  } finally {
    items.value = await manager.value.get(chips.value);
    if (variant === "departments") emit("emit-table-change");
    close();
  }
};

const handleVerified = (v: boolean) => {
  verified.value = v;
};

const handleSaveData = (data: any) => emit("save-data", data);

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
</script>

<template>
  <v-card class="rounded-xl elevation-2">
    <v-data-table
      :headers="headers"
      :items="filtered"
      :sort-by="sortBy"
      class="bg-surface-2"
      :items-per-page-options="[
        { value: 5, title: '5' },
        { value: 10, title: '10' },
        { value: 15, title: '15' },
        { value: 20, title: '20' },
        { value: -1, title: '$vuetify.dataFooter.itemsPerPageAll' },
      ]"
    >
      <template v-slot:top>
        <v-toolbar flat density="compact" class="bg-surface-2 pa-n4">
          <v-toolbar-title class="bg-surface-2 ml-0">{{ toolbarTitle }}</v-toolbar-title>
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
            :disable="tableAdd"
            :confirm-disable="verified"
            @close="close"
            @confirm="save"
          >
            <template v-slot>
              <stepper
                v-if="variant === 'documents'"
                @verified="handleVerified"
                @save-data="handleSaveData"
                :edited-item="editedItem"
              ></stepper>
              <chip-input
                v-if="variant === 'departments'"
                @save-data="handleSaveData"
                :edited-item="editedItem"
              ></chip-input>
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

      <template v-if="props.langsVariant === 'list'" v-slot:item.languages="{ item }">
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
