<script setup lang="ts">
import { ref, computed, watchEffect, nextTick } from "vue";
import { ResponseStatus } from "../../models/common/ResponseStatus";
import tableDialog from "./tableDialog.vue";
// import DialogInput from "./DialogInput.vue";
import { IPermission } from "../../interfaces/user/IPermission";

const props = defineProps<{
  headers: any;
  searchByKeys: Array<string>;
  sortBy: Array<{ key: string; order?: boolean | "asc" | "desc" }>;
  toolbarTitle: string;
  manager: any;
  reqData: any;
}>();

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

(async () => {
  try {
    items.value = await manager.value.get();
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

const responseStatus = ref<ResponseStatus | null>(null);

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
    items.value = await manager.value.get();
    close();
  }
};

// const handleSaveData = (data: any) => emit("save-data", data);

const permission = (item: any) => {
  const { id, ...permissionWithoutId } = item.permission;
  const p: IPermission = permissionWithoutId;
  if (p.control) return "Admin";
  if (p.write) return "Moderator";
  else return "User";
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

          <table-dialog
            v-model="dialog"
            variant="Save"
            :index="editedIndex"
            :loading="dialogLoading"
            @close="close"
            @confirm="save"
            :showBtn="false"
          >
            <template v-slot>
              <!-- <dialog-input
                @save-data="handleSaveData"
                :edited-item="editedItem"
                label="Permission"
                :items="['User', 'Moderator', 'Admin']"
              ></dialog-input> -->
            </template>
          </table-dialog>
        </v-toolbar>
      </template>

      <template v-slot:item.permission="{ item }">
        <span class="text-body-2">{{ permission(item) }}</span>
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
      </template>
    </v-data-table>
  </v-card>
</template>
