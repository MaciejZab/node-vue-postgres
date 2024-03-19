<script setup lang="ts">
import { ref } from "vue";
import AllDocsFilters from "../../components/views/tools/documents/all/AllDocsFilters.vue";
import AllDocsTable from "../../components/views/tools/documents/all/AllDocsTable.vue";
import FavDocsTable from "../../components/views/tools/documents/favorites/FavDocsTable.vue";
import MyDocsFilters from "../../components/views/tools/documents/my/MyDocsFilters.vue";
import MyDocsTable from "../../components/views/tools/documents/my/MyDocsTable.vue";
import RecDocsTable from "../../components/views/tools/documents/recent/RecDocsTable.vue";
import { Chips } from "../../interfaces/document/Chips";
import { Level } from "../../interfaces/document/Level";

const smallScreen = ref<boolean>(window.innerWidth < 960);

const tabs = [
  {
    id: 1,
    name: "my_documents",
    icon: "mdi-folder-account",
  },
  {
    id: 2,
    name: "my_favorites",
    icon: "mdi-star",
  },
  {
    id: 3,
    name: "all_documents",
    icon: "mdi-file-multiple",
  },
  {
    id: 4,
    name: "recently_browsed",
    icon: "mdi-history",
  },
];

const currentTab = ref<number>(3);

const chips = ref<Chips | undefined>(undefined);
const table = ref<Level | undefined>(undefined);

const handleChips = (newValue: Chips): void => {
  chips.value = newValue;
};
const handleTable = (newValue: Level): void => {
  table.value = newValue;
  setTimeout(() => {
    table.value = undefined;
  }, 0);
};
</script>

<template>
  <v-container class="layout-view-container bg-background">
    <v-row>
      <v-col>
        <v-container
          fluid
          class="d-flex bg-surface-1 text-on-surface-1 rounded-xl"
          :class="smallScreen ? 'flex-column' : 'flex-row'"
        >
          <v-row :class="smallScreen ? '' : 'w-25'">
            <v-col>
              <v-card class="rounded-xl elevation-2 bg-surface-2 text-on-surface">
                <v-tabs
                  v-model="currentTab"
                  color="secondary"
                  class="ma-4"
                  :direction="smallScreen ? 'horizontal' : 'vertical'"
                >
                  <v-tab
                    v-for="tab in tabs"
                    :key="tab.id"
                    :value="tab.id"
                    class="rounded"
                    :disabled="tab.id === 1 || tab.id === 2 || tab.id === 4 ? true : false"
                  >
                    <v-icon size="28">{{ tab.icon }}</v-icon>
                    {{ smallScreen ? "" : $t(`tools.documents.tabs.${tab.name}`) }}
                  </v-tab>
                </v-tabs>
              </v-card>
            </v-col>
          </v-row>
          <v-row :class="smallScreen ? 'mt-1' : 'w-75 ml-1 pl-0 mt-n3'">
            <v-col class="h-100">
              <v-window v-model="currentTab" class="w-100">
                <v-window-item :value="1">
                  <my-docs-filters
                    @chips="handleChips"
                    :table="table"
                    class="bg-surface-2 mb-4"
                  ></my-docs-filters>
                  <my-docs-table
                    @table="handleTable"
                    :chips="chips"
                    class="bg-surface-2"
                  ></my-docs-table>
                </v-window-item>
                <v-window-item :value="2">
                  <fav-docs-table
                    @table="handleTable"
                    :chips="chips"
                    class="bg-surface-2"
                  ></fav-docs-table>
                </v-window-item>
                <v-window-item :value="3">
                  <all-docs-filters
                    @chips="handleChips"
                    :table="table"
                    class="bg-surface-2 mb-4"
                  ></all-docs-filters>
                  <all-docs-table
                    @table="handleTable"
                    :chips="chips"
                    class="bg-surface-2"
                  ></all-docs-table>
                </v-window-item>
                <v-window-item :value="4">
                  <rec-docs-table
                    @table="handleTable"
                    :chips="chips"
                    class="bg-surface-2"
                  ></rec-docs-table>
                </v-window-item>
              </v-window>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss">
@media (max-width: 959px) {
  .tab {
    width: 21px;
    padding: 0 8px;
  }
}
</style>
../../components/views/tools/documents/all/DocsFilters.vue../../components/views/tools/documents/all/DocsTable.vue
