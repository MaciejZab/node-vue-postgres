<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { ResponseStatus } from "../../../../../models/common/ResponseStatus";
import { IChips } from "../../../../../interfaces/document/IChips";
import { IChip } from "../../../../../interfaces/document/IChip";
import { ILevel } from "../../../../../interfaces/document/ILevel";
import { DepartmentsManager } from "../../../../../models/document/DepartmentsManager";
import { SubcategoriesManager } from "../../../../../models/document/SubcategoriesManager";
import { CategoriesManager } from "../../../../../models/document/CategoriesManager";
import tableDialog from "../../../../../components/tools/tableDialog.vue";

const emit = defineEmits(["table"]);

const props = defineProps<{
  chips: IChips | undefined;
}>();

const DepManager = new DepartmentsManager();
const CatManager = new CategoriesManager();
const SubManager = new SubcategoriesManager();

const documents = ref<Array<IChip>>([]);

const level = ref<ILevel>(ILevel.Dep);
const manager = ref<DepartmentsManager | CategoriesManager | SubcategoriesManager>(DepManager);

const emitTableChange = () => {
  emit("table", level.value);
};

(async () => {
  try {
    documents.value = await DepManager.get();
  } catch (error) {
    console.log(error);
  }
})();

const department = ref<string | undefined>(undefined);
const category = ref<string | undefined>(undefined);
const subcategory = ref<string | undefined>(undefined);

const tableItem = ref<string>("Department");

watch(
  () => [props.chips?.department, props.chips?.category, props.chips?.subcategory],
  ([dep, cat, sub]) => {
    const reqData: any = {
      categoryName: cat,
      departmentName: dep,
    };

    if (sub) {
      (async () => {
        try {
          tableItem.value = "Document";
        } catch (error) {
          console.log(error);
        }
      })();
    } else if (cat) {
      (async () => {
        try {
          documents.value = await SubManager.get(reqData);
          level.value = ILevel.Sub;
          manager.value = SubManager;
          tableItem.value = "Workstation";
        } catch (error) {
          console.log(error);
        }
      })();
    } else if (dep) {
      (async () => {
        try {
          documents.value = await CatManager.get(reqData);
          level.value = ILevel.Cat;
          manager.value = CatManager;
          tableItem.value = "Program";
        } catch (error) {
          console.log(error);
        }
      })();
    } else {
      (async () => {
        try {
          documents.value = await DepManager.get();
          level.value = ILevel.Dep;
          manager.value = DepManager;
          tableItem.value = "Department";
        } catch (error) {
          console.log(error);
        }
      })();
    }

    department.value = dep;
    category.value = cat;
    subcategory.value = sub;
  }
);

const responseStatus = ref<ResponseStatus | null>(null);

const headers = ref<any>([
  { title: "Name", align: "start", key: "name" },
  { title: "Actions", key: "actions", sortable: false },
]);

const search = ref<string>("");

const filteredDocuments = computed(() => {
  return documents.value.filter((document) => {
    const name = document.name.toLowerCase();
    const searchTerm = search.value.toLowerCase();

    return name.includes(searchTerm);
  });
});

const dialog = ref<boolean>(false);
const dialogLoading = ref<boolean>(false);
const dialogDelete = ref<boolean>(false);
const dialogDeleteLoading = ref<boolean>(false);
const editedIndex = ref<number>(-1);

const editedItem = ref<IChip>({ id: 0, name: "" });
const defaultItem: IChip = { id: 0, name: "" };

const editItem = (item: any) => {
  editedIndex.value = documents.value.indexOf(item);
  editedItem.value = { ...item };
  dialog.value = true;
};

const deleteItemConfirm = async () => {
  const reqData: any = {
    name: editedItem.value.name,
    categoryName: category.value,
    departmentName: department.value,
  };

  const itemId: number = editedItem.value.id;

  dialogDeleteLoading.value = true;
  try {
    await manager.value.delete(itemId);
    documents.value = await manager.value.get(reqData);
    emitTableChange();
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

const deleteItem = async (item: IChip) => {
  editedIndex.value = documents.value.indexOf(item);
  editedItem.value = { ...item };
  dialogDelete.value = true;
};

const save = async () => {
  const reqData: any = {
    id: editedItem.value.id,
    name: editedItem.value.name,
    categoryName: category.value,
    departmentName: department.value,
  };

  dialogLoading.value = true;
  if (editedIndex.value > -1) {
    try {
      await manager.value.put(reqData);
      documents.value = await manager.value.get(reqData);
      emitTableChange();
    } catch (error: any) {
      console.log(error);
      responseStatus.value = new ResponseStatus({
        code: error.response.status,
        message: error.response.data.statusMessage,
      });
    }
  } else {
    try {
      await manager.value.post(reqData);
      documents.value = await manager.value.get(reqData);
      emitTableChange();
    } catch (error: any) {
      console.log(error);
      responseStatus.value = new ResponseStatus({
        code: error.response.status,
        message: error.response.data.statusMessage,
      });
    }

    // if (!responseStatus) documents.value.push(editedItem.value);
  }

  dialogLoading.value = false;
  close();
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
        <v-toolbar flat density="compact" class="pa-n4">
          <v-toolbar-title class="ml-0">{{ `${tableItem}s` }}</v-toolbar-title>
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
            :item="tableItem"
            :index="editedIndex"
            :loading="dialogLoading"
            @close="close"
            @confirm="save"
          >
            <template v-slot>
              <v-text-field
                v-model="editedItem.name"
                variant="underlined"
                label="Name"
              ></v-text-field>
            </template>
          </table-dialog>

          <table-dialog
            v-model="dialogDelete"
            variant="Delete"
            :item="tableItem"
            :index="editedIndex"
            :loading="dialogDeleteLoading"
            @close="closeDelete"
            @confirm="deleteItemConfirm"
          >
          </table-dialog>
        </v-toolbar>
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
