<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { ResponseStatus } from "../../../../models/common/ResponseStatus";
import { Chips } from "../../../../interfaces/document/Chips";
import { Chip } from "../../../../interfaces/document/Chip";
import { Level } from "../../../../interfaces/document/Level";
import { DepartmentsManager } from "../../../../models/document/DepartmentsManager";
import { SubcategoriesManager } from "../../../../models/document/SubcategoriesManager";
import { CategoriesManager } from "../../../../models/document/CategoriesManager";

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

watch(
  () => [props.chips?.department, props.chips?.category],
  ([dep, cat]) => {
    const reqData: any = {
      categoryName: cat,
      departmentName: dep,
    };

    if (cat) {
      (async () => {
        try {
          documents.value = await SubManager.get(reqData);
          level.value = Level.Sub;
          manager.value = SubManager;
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
        } catch (error) {
          console.log(error);
        }
      })();
    }

    department.value = dep;
    category.value = cat;
  }
);

const responseStatus = ref<ResponseStatus | null>(null);

const headers: any = [
  { title: "Name", align: "start", key: "name" },
  { title: "Actions", key: "actions", sortable: false },
];

const search = ref<string>("");
const dialog = ref<boolean>(false);
const dialogDelete = ref<boolean>(false);
const editedIndex = ref<number>(-1);

const editedItem = ref<Chip>({ id: 0, name: "" });
const defaultItem: Chip = { id: 0, name: "" };

const formTitle = computed(() => (editedIndex.value === -1 ? "New Item" : "Edit Item"));

const addToFavorites = (item: any) => {
  console.log(item);
  // add logic
};

const editItem = (item: any) => {
  editedIndex.value = documents.value.indexOf(item);
  editedItem.value = { ...item };
  dialog.value = true;
};

const deleteItemConfirm = () => {
  documents.value.splice(editedIndex.value, 1);
  closeDelete();
};

const close = () => {
  dialog.value = false;
  nextTick(() => {
    editedItem.value = { ...defaultItem };
    editedIndex.value = -1;
  });
};

const closeDelete = () => {
  dialogDelete.value = false;
  nextTick(() => {
    editedItem.value = { ...defaultItem };
    editedIndex.value = -1;
  });
};

const deleteItem = (item: Chip) => {
  editedIndex.value = documents.value.indexOf(item);
  editedItem.value = { ...item };
  dialogDelete.value = true;

  // let endpoint: string;
  // const itemId: number = editedItem.value.id;
  // let callback: (() => Promise<void | Array<Chip>>) | undefined;

  // switch (level.value) {
  //   case Level.Dep:
  //     endpoint = Endpoints.DocumentDepartment;
  //     callback = async () => (documents.value = await DepManager.delete(itemId));

  //     break;
  //   case Level.Cat:
  //     endpoint = Endpoints.DocumentCategory;
  //     callback = async () => (documents.value = await CatManager.delete(itemId));

  //     break;
  //   case Level.Sub:
  //     endpoint = Endpoints.DocumentSubcategory;
  //     callback = async () => (documents.value = await SubManager.delete(itemId));

  //     break;
  //   default:
  //     return;
  // }
};

const save = async () => {
  const reqData: any = {
    name: editedItem.value.name,
    categoryName: category.value,
    departmentName: department.value,
  };

  if (editedIndex.value > -1) {
    Object.assign(documents.value[editedIndex.value], editedItem.value);
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

    if (!responseStatus) documents.value.push(editedItem.value);
  }

  close();
};
</script>

<template>
  <v-data-table :headers="headers" :items="documents" :sort-by="[{ key: 'name', order: 'asc' }]">
    <template v-slot:top>
      <v-toolbar flat color="secondary" density="compact">
        <v-toolbar-title></v-toolbar-title>
        <v-text-field
          v-model="search"
          append-inner-icon="mdi-magnify"
          density="compact"
          variant="outlined"
          clearable
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ props }">
            <v-btn class="mr-4" height="40px" variant="outlined" v-bind="props"> New Item </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field v-model="editedItem.name" label="Name"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="close"> Cancel </v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="save"> Save </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.favorite="{ item }">
      <v-icon size="small" @click="addToFavorites(item)">mdi-star-outline</v-icon>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon size="small" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon size="small" @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
    <!-- <template v-slot:no-data>
      <v-btn color="primary" @click="initialize"> Reset </v-btn>
    </template> -->
  </v-data-table>
</template>
