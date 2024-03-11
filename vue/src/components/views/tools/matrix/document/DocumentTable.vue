<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { ResponseStatus } from "../../../../../models/common/ResponseStatus";
import { Chips } from "../../../../../interfaces/document/Chips";
// import { Chip } from "../../../../../interfaces/document/Chip";
import { Document } from "../../../../../interfaces/document/Document";
import { Level } from "../../../../../interfaces/document/Level";
import { DepartmentsManager } from "../../../../../models/document/DepartmentsManager";
import { SubcategoriesManager } from "../../../../../models/document/SubcategoriesManager";
import { CategoriesManager } from "../../../../../models/document/CategoriesManager";
import { useI18n } from "vue-i18n";

const emit = defineEmits(["table"]);

const props = defineProps<{
  chips: Chips | undefined;
}>();

const { t } = useI18n();

const DepManager = new DepartmentsManager();
const CatManager = new CategoriesManager();
const SubManager = new SubcategoriesManager();

const documents = ref<Array<Document>>([]);

const level = ref<Level>(Level.Dep);
const manager = ref<DepartmentsManager | CategoriesManager | SubcategoriesManager>(DepManager);

const emitTableChange = () => {
  emit("table", level.value);
};

(async () => {
  try {
    // documents.value = await DepManager.get();
  } catch (error) {
    console.log(error);
  }
})();

const department = ref<string | undefined>(undefined);
const category = ref<string | undefined>(undefined);
const subcategory = ref<string | undefined>(undefined);

// const tableItem = ref<string>("Department");

const tableAddDisabled = ref<boolean>(true);
const tableAdd = computed(() => t("tools.matrix.documents.add_button"));

watch(
  () => [props.chips?.department, props.chips?.category, props.chips?.subcategory],
  ([dep, cat, sub]) => {
    // const reqData: any = {
    //   categoryName: cat,
    //   departmentName: dep,
    // };

    if (sub) {
      (async () => {
        try {
          tableAddDisabled.value = false;
        } catch (error) {
          console.log(error);
        }
      })();
    } else if (cat) {
      (async () => {
        try {
          // documents.value = await SubManager.get(reqData);
          level.value = Level.Sub;
          manager.value = SubManager;
          tableAddDisabled.value = true;
        } catch (error) {
          console.log(error);
        }
      })();
    } else if (dep) {
      (async () => {
        try {
          // documents.value = await CatManager.get(reqData);
          level.value = Level.Cat;
          manager.value = CatManager;
          tableAddDisabled.value = true;
        } catch (error) {
          console.log(error);
        }
      })();
    } else {
      (async () => {
        try {
          // documents.value = await DepManager.get();
          level.value = Level.Dep;
          manager.value = DepManager;
          tableAddDisabled.value = true;
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

const headers: any = [
  {
    title: "Name",
    align: "start",
    key: "name",
  },
  { title: "Description", key: "description" },
  { title: "Competence", key: "competence" },
  { title: "Favorite", key: "favorite", sortable: false },
  { title: "Actions", key: "actions", sortable: false },
];

const search = ref<string>("");
const dialog = ref<boolean>(false);
const dialogDelete = ref<boolean>(false);
const editedIndex = ref<number>(-1);

const editedItem = ref<Document>({ id: 0, name: "", description: "", competence: "" });
const defaultItem: Document = { id: 0, name: "", description: "", competence: "" };

const formTitle = computed(() => (editedIndex.value === -1 ? `New Document` : `Edit Document`));

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

  const itemId: number = editedItem.value.id;

  try {
    await manager.value.delete(itemId);
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

const deleteItem = async (item: Document) => {
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
      // documents.value = await manager.value.get(reqData);
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
      // documents.value = await manager.value.get(reqData);
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
            <v-card>
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
