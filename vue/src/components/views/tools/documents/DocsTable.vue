<script setup lang="ts">
import { computed, nextTick, ref } from "vue";

const search = ref<string>("");
const dialog = ref(false);
const dialogDelete = ref(false);
const editedIndex = ref(-1);
const editedItem = ref({
  name: "",
  description: "",
  competence: "",
});
const defaultItem = {
  name: "",
  description: "",
  competence: "",
};

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

const documents = ref([
  {
    name: "Project Proposal",
    description:
      "A comprehensive proposal outlining the scope, objectives, and deliverables of the project.",
    competence: "Project Management",
  },
  {
    name: "Project Plan",
    description: "A detailed plan outlining tasks, timelines, and resources for project execution.",
    competence: "Project Management",
  },
  {
    name: "Training Manual",
    description: "A detailed manual providing instructions and guidelines for training sessions.",
    competence: "Training and Development",
  },
  {
    name: "Employee Handbook",
    description:
      "A comprehensive guide outlining company policies, procedures, and employee benefits.",
    competence: "Training and Development",
  },
  {
    name: "Marketing Strategy",
    description:
      "An elaborate strategy document outlining marketing goals, target audience, and promotional tactics.",
    competence: "Marketing",
  },
  {
    name: "Social Media Campaign Plan",
    description: "A plan detailing strategies and content for social media marketing campaigns.",
    competence: "Marketing",
  },
  {
    name: "Financial Report",
    description:
      "A detailed report summarizing the financial performance and analysis of the company.",
    competence: "Financial Analysis",
  },
  {
    name: "Budget Forecast",
    description: "A financial forecast outlining projected revenues, expenses, and cash flows.",
    competence: "Financial Analysis",
  },
  {
    name: "Product Design Specification",
    description:
      "A specification document detailing the design requirements and features of a product.",
    competence: "Product Design",
  },
  {
    name: "User Interface Wireframes",
    description: "Wireframe designs outlining the layout and functionality of user interfaces.",
    competence: "Product Design",
  },
]);

// const initialize = () => {
//   documents.value = [
//     {
//       name: "",
//       description: "",
//       competence: "",
//     },
//   ];
// };

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

const save = () => {
  if (editedIndex.value > -1) {
    Object.assign(documents.value[editedIndex.value], editedItem.value);
  } else {
    documents.value.push(editedItem.value);
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
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedItem.description"
                      label="Description"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field v-model="editedItem.competence" label="Competence"></v-text-field>
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
