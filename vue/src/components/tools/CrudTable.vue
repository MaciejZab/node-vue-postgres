<script setup lang="ts">
import { computed, nextTick, ref, watch, watchEffect } from "vue";
import TableDialog from "./TableDialog.vue";
import { IResponseStatus } from "../../interfaces/common/IResponseStatus";
import { ResponseStatus } from "../../models/common/ResponseStatus";

const props = defineProps<{
  headers: any;
  sortBy: Array<{ key: string; order?: boolean | "asc" | "desc" }>;

  searchBy: Array<string>; // header keys
  toolbarTitle: string;
  searchTitle?: string;

  manager: any;
  reqData?: any;

  chips?: any;
  emitTableChange?: true;
  disableAdd?: boolean;

  tableAdd?: true;
  tableDelete?: true;
  tableEdit?: true;

  tableDialogComponent?: any;
  tableDialogComponentProps?: any;
}>();

const emit = defineEmits(["save-data", "emit-table-change", "responseStatus"]);

const headers = ref<any>(props.headers);
const items = ref<Array<any>>([]);

const toolbarTitle = ref<string>(props.toolbarTitle);
const search = ref<string>("");
const searchTitle = ref<string>(props.searchTitle ? props.searchTitle : "Search");
const filtered = computed(() => {
  if (search.value) {
    return items.value.filter((item: any) => {
      for (const key of props.searchBy) {
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
const dialog = ref<boolean>(false);
const dialogLoading = ref<boolean>(false);
const dialogDelete = ref<boolean>(false);
const dialogDeleteLoading = ref<boolean>(false);

const manager = ref<any>(props.manager);
const item = ref<any>({ ...manager.value.new() });
const editedItem = ref<any>({ ...item.value });
const ComponentProps = computed(() => {
  return {
    ...props.tableDialogComponentProps,
    editedItem: editedItem.value,
  };
});
const editedIndex = ref<number>(-1);

const chips = ref<any>(props.chips);

(async () => (items.value = await manager.value.get(chips.value)))();

const reqData = ref<any>(props.reqData);

const disableAdd = ref<boolean>(props.disableAdd === undefined ? false : props.disableAdd);

const responseStatus = ref<IResponseStatus | null>(null);

watchEffect(() => {
  emit("responseStatus", responseStatus.value);
});

const verified = ref<boolean>(false);

watchEffect(() => {
  headers.value = props.headers;
});

watchEffect(() => {
  toolbarTitle.value = props.toolbarTitle;
});

watchEffect(() => {
  reqData.value = props.reqData;
});

watchEffect(() => {
  disableAdd.value = props.disableAdd;
});

// watchEffect(async () => {
//   manager.value = props.manager;
//   chips.value = props.chips;
//   items.value = await manager.value.get(chips.value);
// });

watch(
  [() => props.manager, () => props.chips],
  async ([newManager, newChips]) => {
    manager.value = newManager;
    chips.value = newChips;
    items.value = await manager.value.get(chips.value);
  },
  { deep: true }
);

const deleteItem = async (item: any) => {
  editedIndex.value = items.value.indexOf(item);
  editedItem.value = { ...item };
  dialogDelete.value = true;
};
const editItem = (item: any) => {
  editedIndex.value = items.value.indexOf(item);
  editedItem.value = { ...item };
  dialog.value = true;
};

const close = () => {
  dialog.value = false;
  dialogLoading.value = false;

  nextTick(() => {
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

const deleteItemConfirm = async () => {
  try {
    dialogDeleteLoading.value = true;
    responseStatus.value = await manager.value.delete(editedItem.value.id, true);
    if (props.emitTableChange) emit("emit-table-change");
    items.value = await manager.value.get(chips.value);
  } catch (error: any) {
    console.log(error);
    responseStatus.value = new ResponseStatus({
      code: error.response.status,
      message: error.response.data.statusMessage,
    });
  } finally {
    dialogDeleteLoading.value = false;
    closeDelete();
  }
};

const save = async () => {
  try {
    const data: any = reqData.value;
    dialogLoading.value = true;
    if (editedIndex.value > -1) responseStatus.value = await manager.value.put(data, true);
    else responseStatus.value = await manager.value.post(data, true);
  } catch (error: any) {
    console.log(error);
    responseStatus.value = new ResponseStatus({
      code: error.response.status,
      message: error.response.data.statusMessage,
    });
  } finally {
    items.value = await manager.value.get(chips.value);
    if (props.emitTableChange) emit("emit-table-change");
    close();
  }
};

const handleVerified = (v: boolean) => (verified.value = v);

const handleSaveData = (data: any) => emit("save-data", data);
</script>

<template>
  <v-card class="rounded-xl elevation-2">
    <v-data-table
      :headers="headers"
      :items="filtered"
      :sort-by="props.sortBy"
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
            :label="searchTitle"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            color="primary"
            hide-details
            single-line
            :rounded="true"
          ></v-text-field>
          <v-divider v-if="props.tableAdd" class="mx-4" inset vertical></v-divider>

          <table-dialog
            persistent
            no-click-animation
            :retain-focus="false"
            v-model="dialog"
            variant="Save"
            :disable="disableAdd"
            :confirm-disable="verified"
            :index="editedIndex"
            :loading="dialogLoading"
            @close="close"
            @confirm="save"
            :showBtn="props.tableAdd"
          >
            <component
              :is="props.tableDialogComponent"
              @verified="handleVerified"
              @save-data="handleSaveData"
              :componentProps="ComponentProps"
            ></component>
          </table-dialog>

          <slot name="table-dialog-add-edit"></slot>

          <table-dialog
            v-model="dialogDelete"
            variant="Delete"
            delete-t-msg="deleteDocumentConfirmation"
            :index="editedIndex"
            :loading="dialogDeleteLoading"
            @close="closeDelete"
            @confirm="deleteItemConfirm"
            :showBtn="false"
          >
          </table-dialog>
        </v-toolbar>
      </template>

      <template v-slot:item.custom="{ item }">
        <slot name="table-key-slot" :item="item"></slot>
      </template>

      <template v-slot:item.custom2="{ item }">
        <slot name="table-key-slot-2" :item="item"></slot>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-btn
          v-if="props.tableEdit"
          variant="tonal"
          color="primary"
          size="small"
          @click="editItem(item)"
          icon="mdi-pencil"
          class="ma-2"
        />

        <v-btn
          v-if="props.tableDelete"
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
