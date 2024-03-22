<script setup lang="ts">
import { ref, computed, watchEffect } from "vue";

const props = defineProps<{
  headers: any;
  searchByKeys: Array<string>;
  sortBy: Array<{ key: string; order: string }>;
  items: Array<T>;
}>();

const headers = ref<any>(props.headers);
const items = ref<Array<T>>(props.items);

const filterKeys: Array<string> = props.searchByKeys;
const sortBy = props.sortBy;

const filtered = computed(() => {
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
});

watchEffect(() => {
  headers.value = props.headers;
  items.value = props.items;
});

// TABLE FUNCTIONS
const deleteItem = async (item: T) => {
  editedIndex.value = documents.value.indexOf(item);
  editedItem.value = { ...item };
  dialogDelete.value = true;
};
const editItem = (item: T) => {
  editedIndex.value = documents.value.indexOf(item);
  editedItem.value = { ...item };
  dialog.value = true;
};
</script>

<template>
  <v-card class="rounded-xl elevation-2">
    <v-data-table :headers="headers" :items="filtered" :sort-by="sortBy" class="bg-surface-2">

      <template v-slot:item.actions="{ item }">
        <v-btn
          variant="tonal"
          color="primary"
          size="small"
          @click="editItem(item)"
          icon="mdi-pencil"
          class="ma-2"
        />

        <v-btn
          variant="tonal"
          color="primary"
          size="small"
          @click="deleteItem(item)"
          icon="mdi-delete"
          class="ma-2"
        />
      </template>
    </v-data-table>
    </v-data-table>
  </v-card>
</template>
