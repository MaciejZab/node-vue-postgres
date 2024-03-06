<script setup lang="ts">
import { ref } from "vue";
import DepartmentFilters from "../../components/views/tools/matrix/DepartmentFilters.vue";
import DepartmentTable from "../../components/views/tools/matrix/DepartmentTable.vue";
import { Chips } from "../../interfaces/document/Chips";

const smallScreen = ref<boolean>(window.innerWidth < 960);

const tabs = [
  {
    id: 1,
    name: "departments",
    icon: "mdi-office-building",
  },
];

const currentTab = ref<number>(1);

const chips = ref<Chips | undefined>(undefined);

const handleChips = (newValue: Chips): Chips => (chips.value = newValue);
</script>

<template>
  <v-container class="layout-view-container">
    <v-row>
      <v-col>
        <v-card elevation="6">
          <v-toolbar color="secondary" height="32px">
            <v-toolbar-title></v-toolbar-title>
          </v-toolbar>
          <div class="d-flex" :class="smallScreen ? 'flex-column' : 'flex-row'">
            <v-tabs
              v-model="currentTab"
              color="secondary"
              :direction="smallScreen ? 'horizontal' : 'vertical'"
            >
              <v-tab v-for="tab in tabs" :key="tab.id" :value="tab.id">
                <v-icon size="large">{{ tab.icon }}</v-icon>
                {{ smallScreen ? "" : $t(`common.default_layout.tool.matrix.tabs.${tab.name}`) }}
              </v-tab>
            </v-tabs>
            <v-window v-model="currentTab" class="w-100">
              <v-window-item :value="1">
                <department-filters @chips="handleChips"></department-filters>
                <DepartmentTable :chips="chips"></DepartmentTable>
              </v-window-item>
            </v-window>
          </div>
        </v-card>
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
