<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { nodeConfig } from "../../../../config/env";
import { Endpoints } from "../../../../config/Endpoints";
import axios from "axios";
import { ResponseStatus } from "../../../../models/common/ResponseStatus";
import { Chips } from "../../../../interfaces/document/Chips";
import { Chip } from "../../../../interfaces/document/Chip";

const props = defineProps<{
  chips: Chips | undefined;
}>();

const documents = ref<Array<Chip>>([]);

const getSubcategories = async (
  departmentName: string,
  categoryName: string
): Promise<Array<Chip>> => {
  const response = await axios.get(
    `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.DocumentSubcategory}/${departmentName}/${categoryName}`
  );
  return response.data.got;
};

const getCategories = async (departmentName: string): Promise<Array<Chip>> => {
  const response = await axios.get(
    `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.DocumentCategory}/${departmentName}`
  );
  return response.data.got;
};

const getDepartments = async (): Promise<Array<Chip>> => {
  const response = await axios.get(
    `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.DocumentDepartment}`
  );
  return response.data.got;
};

enum Level {
  Dep,
  Cat,
  Sub,
}

const level = ref<Level>(Level.Dep);

(async () => {
  try {
    documents.value = await getDepartments();
  } catch (error) {
    console.log(error);
  }
})();

const department = ref<string | undefined>(undefined);
const category = ref<string | undefined>(undefined);

watch(
  () => [props.chips?.department, props.chips?.category],
  ([dep, cat]) => {
    if (cat) {
      (async () => {
        try {
          documents.value = await getSubcategories(dep as string, cat as string);
          level.value = Level.Sub;
        } catch (error) {
          console.log(error);
        }
      })();
    } else if (dep) {
      (async () => {
        try {
          documents.value = await getCategories(dep as string);
          level.value = Level.Cat;
        } catch (error) {
          console.log(error);
        }
      })();
    } else {
      (async () => {
        try {
          documents.value = await getDepartments();
          level.value = Level.Dep;
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

const deleteItem = (item: any) => {
  editedIndex.value = documents.value.indexOf(item);
  editedItem.value = { ...item };
  dialogDelete.value = true;
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

const save = async () => {
  let endpoint: string;
  let requestBody: any;

  switch (level.value) {
    case Level.Dep:
      endpoint = Endpoints.DocumentDepartment;
      requestBody = { name: editedItem.value.name };
      break;
    case Level.Cat:
      endpoint = Endpoints.DocumentCategory;
      requestBody = {
        name: editedItem.value.name,
        departmentName: department.value,
      };
      console.log(requestBody);
      break;
    case Level.Sub:
      endpoint = Endpoints.DocumentSubcategory;
      requestBody = {
        name: editedItem.value.name,
        categoryName: category.value,
        departmentName: department.value,
      };
      break;
    default:
      return;
  }

  if (editedIndex.value > -1) {
    Object.assign(documents.value[editedIndex.value], editedItem.value);
  } else {
    try {
      await axios.post(`${nodeConfig.origin}:${nodeConfig.port}${endpoint}`, requestBody);
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
