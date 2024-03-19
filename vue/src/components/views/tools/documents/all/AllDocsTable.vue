<script setup lang="ts">
import { ref, watch } from "vue";
// import { ResponseStatus } from "../../../../models/common/ResponseStatus";
import { Chips } from "../../../../../interfaces/document/Chips";
import { DocumentManager } from "../../../../../models/document/DocumentManager";
import { DocumentEntity } from "../../../../../interfaces/document/DocumentEntity";

const emit = defineEmits(["table"]);

const props = defineProps<{
  chips: Chips | undefined;
}>();

const manager = new DocumentManager();

const documents = ref<Array<DocumentEntity>>([]);

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
    // value: `${item.name}_qs_langs=${lang}&uuid=${item.ref}`,
    value: [item.name, lang, item.ref],
  }));
};

// const documentsData = computed(() => {
//   const transformed = documents.value.map((document) => ({
//     id: document.id,
//     name: document.name,
//     description: document.description,
//     languages: languages(document.languages),
//   }));

//   console.log(transformed);
//   return transformed;
// });

(async () => {
  try {
    documents.value = await manager.get({
      department: "",
      category: "",
      subcategory: "",
    });
  } catch (error) {
    console.log(error);
  }
})();

const department = ref<string | undefined>(undefined);
const category = ref<string | undefined>(undefined);
const subcategory = ref<string | undefined>(undefined);

watch(
  () => [props.chips?.department, props.chips?.category, props.chips?.subcategory],
  async ([dep, cat, sub]) => {
    const reqData: any = {
      department: dep,
      category: cat,
      subcategory: sub,
    };

    try {
      documents.value = await manager.get(reqData);
    } catch (error) {
      console.log(error);
    }

    department.value = dep;
    category.value = cat;
    subcategory.value = sub;
  }
);

// const responseStatus = ref<ResponseStatus | null>(null);

const headers: any = [
  { title: "Name", align: "start", key: "name" },
  { title: "Description", key: "description" },
  { title: "View Document", key: "languages", sortable: false, filterable: false },
  // { title: "Favorite", key: "favorite", sortable: false, filterable: false },
];

const search = ref<string>("");

const navigateToRoute = (file: Array<string>) => {
  const url = `/tool/documents/${file.at(0)}/${file.at(1)}/${file.at(2)}`;
  window.open(url, "_blank");
};

const addToFavorites = (item: any) => {
  console.log(item);
  // add logic
};
</script>

<template>
  <v-card class="rounded-xl elevation-2 pa-4">
    <v-data-table
      :headers="headers"
      :items="documents"
      :sort-by="[{ key: 'name', order: 'asc' }]"
      :search="search"
      class="bg-surface-2"
    >
      <template v-slot:top>
        <v-toolbar flat density="compact" class="pa-n4" color="surface-2">
          <v-toolbar-title class="ml-0">{{ $t(`tools.documents.name`) }}</v-toolbar-title>
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
        </v-toolbar>
      </template>
      <template v-slot:item.languages="{ item }">
        <v-select
          :items="languages(item)"
          item-title="title"
          item-value="value"
          density="compact"
          variant="underlined"
          label="Select language"
          color="primary"
          hide-details
          class="my-5"
        >
          <template #item="{ item }">
            <v-list-item @click="navigateToRoute(item.value)">
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-select>
      </template>
      <template v-slot:item.favorite="{ item }">
        <v-btn
          variant="text"
          size="small"
          @click="addToFavorites(item)"
          icon="mdi-star-outline"
          class="ma-2"
        />
      </template>
    </v-data-table>
  </v-card>
</template>
