<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { ResponseStatus } from "../../../../../models/common/ResponseStatus";
import { Chips } from "../../../../../interfaces/document/Chips";
import { Chip } from "../../../../../interfaces/document/Chip";
import { Level } from "../../../../../interfaces/document/Level";
import { DepartmentsManager } from "../../../../../models/document/DepartmentsManager";
import { SubcategoriesManager } from "../../../../../models/document/SubcategoriesManager";
import { CategoriesManager } from "../../../../../models/document/CategoriesManager";

const emit = defineEmits(["table"]);

const props = defineProps<{
  chips: Chips | undefined;
}>();

const DepManager = new DepartmentsManager();
const CatManager = new CategoriesManager();
const SubManager = new SubcategoriesManager();

const documents = ref<Array<Chip>>([]);

const level = ref<Level>(Level.Dep);
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
          level.value = Level.Sub;
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
          level.value = Level.Cat;
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
          level.value = Level.Dep;
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
const dialog = ref<boolean>(false);
const dialogDelete = ref<boolean>(false);
const editedIndex = ref<number>(-1);

const editedItem = ref<Chip>({ id: 0, name: "" });
const defaultItem: Chip = { id: 0, name: "" };

const formTitle = computed(() =>
  editedIndex.value === -1 ? `New ${tableItem.value}` : `Edit ${tableItem.value}`
);

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

const deleteItem = async (item: Chip) => {
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

  close();
};
</script>

<template>
  <v-card class="rounded-xl elevation-0 pa-4">
    <v-data-table
      :headers="headers"
      :items="documents"
      :sort-by="[{ key: 'name', order: 'asc' }]"
      :search="search"
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
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ props }">
              <v-btn
                class="bg-primary text-on-primary mr-4 rounded-xl"
                height="40px"
                prepend-icon="mdi-plus"
                v-bind="props"
              >
                {{ tableItem }}
              </v-btn>
            </template>
            <v-card class="rounded-xl">
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field v-model="editedItem.name" label="Name"></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="rounded-xl" color="primary" variant="text" @click="close">
                  Cancel
                </v-btn>
                <v-btn class="bg-primary text-on-primary mr-4 rounded-xl" @click="save">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card class="bg-surface rounded-xl">
              <v-card-title class="text-h6">Are you sure you want to proceed?</v-card-title>
              <v-alert
                class="mx-4 mb-8"
                :text="`Deleting this ${tableItem.toLowerCase()} will also affect all of its associated descendants.`"
                border="start"
                type="info"
              >
              </v-alert>
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
../../../../../models/common/ResponseStatus../../../../../interfaces/document/Chips../../../../../interfaces/document/Chip../../../../../interfaces/document/Level../../../../../models/document/DepartmentsManager../../../../../models/document/SubcategoriesManager../../../../../models/document/CategoriesManager
