<script setup lang="ts">
import { ref, watch } from "vue";
// import { ResponseStatus } from "../../../../models/common/ResponseStatus";
import { IChips } from "../../../../../interfaces/document/IChips";
import { InstructionManager } from "../../../../../models/document/InstructionManager";
import { IDocumentEntity } from "../../../../../interfaces/document/IDocumentEntity";
import CrudTable from "../../../../tools/CrudTable.vue";

const emit = defineEmits(["table"]);

const props = defineProps<{
  chips: IChips;
}>();

const manager = new InstructionManager();

const documents = ref<Array<IDocumentEntity>>([]);

enum LangDictionary {
  en = "English",
  pl = "Polish",
  ua = "Ukrainian",
}

// Type alias mimicking the enum with string-based access
type LangDictionaryStringMap = {
  [key: string]: LangDictionary[keyof LangDictionary];
};

const languages = (item: IDocumentEntity) => {
  return item.languages.map((lang: string) => ({
    title: lang
      .split("_")
      .map((code: string) => (LangDictionary as LangDictionaryStringMap)[code])
      .join(", "),
    // value: `${item.name}_qs_langs=${lang}&uuid=${item.ref}`,
    value: [item.name, lang, item.ref],
  }));
};

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
  () => [props.chips?.departmentName, props.chips?.categoryName, props.chips?.subcategoryName],
  async ([dep, cat, sub]) => {
    const reqData: any = {
      departmentName: dep,
      categoryName: cat,
      subcategoryName: sub,
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
  { title: "View Document", key: "custom", sortable: false, filterable: false },
  // { title: "Favorite", key: "custom2", sortable: false, filterable: false },
];

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
  <crud-table
    :headers="headers"
    :sortBy="[{ key: 'name', order: 'asc' }]"
    :searchBy="['name', 'description']"
    toolbarTitle="Instructions"
    :manager="manager"
    :chips="props.chips"
  >
    <template v-slot:table-key-slot="{ item }">
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
    <template v-slot:table-key-slot-2="{ item }">
      <v-btn
        variant="text"
        size="small"
        @click="addToFavorites(item)"
        icon="mdi-star-outline"
        class="ma-2"
      />
    </template>
  </crud-table>
</template>
