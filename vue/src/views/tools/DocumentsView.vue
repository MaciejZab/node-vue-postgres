<script setup lang="ts">
import { ref, watch } from "vue";
import DocsTable from "../../components/views/tools/documents/DocsTable.vue";
import MyFilters from "../../components/views/tools/documents/MyFilters.vue";

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

const currentTab = ref<number>(1);

watch;
</script>

<template>
  <v-container class="layout-view-container">
    <v-row>
      <v-col>
        <v-card class="bg-surface" elevation="6">
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
                {{ smallScreen ? "" : $t(`common.default_layout.tool.documents.tabs.${tab.name}`) }}
              </v-tab>
            </v-tabs>
            <v-window v-model="currentTab" class="w-100">
              <v-window-item :value="1">
                <my-filters></my-filters>
                <docs-table></docs-table>
              </v-window-item>
              <v-window-item :value="2">
                <v-card flat>
                  <v-card-text>
                    <p>
                      Morbi nec metus. Suspendisse faucibus, nunc et pellentesque egestas, lacus
                      ante convallis tellus, vitae iaculis lacus elit id tortor. Sed mollis, eros et
                      ultrices tempus, mauris ipsum aliquam libero, non adipiscing dolor urna a
                      orci. Curabitur ligula sapien, tincidunt non, euismod vitae, posuere
                      imperdiet, leo. Nunc sed turpis.
                    </p>

                    <p>
                      Suspendisse feugiat. Suspendisse faucibus, nunc et pellentesque egestas, lacus
                      ante convallis tellus, vitae iaculis lacus elit id tortor. Proin viverra,
                      ligula sit amet ultrices semper, ligula arcu tristique sapien, a accumsan nisi
                      mauris ac eros. In hac habitasse platea dictumst. Fusce ac felis sit amet
                      ligula pharetra condimentum.
                    </p>

                    <p>
                      Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis
                      gravida magna mi a libero. Nam commodo suscipit quam. In consectetuer turpis
                      ut velit. Sed cursus turpis vitae tortor. Aliquam eu nunc.
                    </p>

                    <p>
                      Etiam ut purus mattis mauris sodales aliquam. Ut varius tincidunt libero.
                      Aenean viverra rhoncus pede. Duis leo. Fusce fermentum odio nec arcu.
                    </p>

                    <p class="mb-0">
                      Donec venenatis vulputate lorem. Aenean viverra rhoncus pede. In dui magna,
                      posuere eget, vestibulum et, tempor auctor, justo. Fusce commodo aliquam arcu.
                      Suspendisse enim turpis, dictum sed, iaculis a, condimentum nec, nisi.
                    </p>
                  </v-card-text>
                </v-card>
              </v-window-item>
              <v-window-item :value="3">
                <v-card flat>
                  <v-card-text>
                    <p>
                      Fusce a quam. Phasellus nec sem in justo pellentesque facilisis. Nam eget dui.
                      Proin viverra, ligula sit amet ultrices semper, ligula arcu tristique sapien,
                      a accumsan nisi mauris ac eros. In dui magna, posuere eget, vestibulum et,
                      tempor auctor, justo.
                    </p>

                    <p class="mb-0">
                      Cras sagittis. Phasellus nec sem in justo pellentesque facilisis. Proin sapien
                      ipsum, porta a, auctor quis, euismod ut, mi. Donec quam felis, ultricies nec,
                      pellentesque eu, pretium quis, sem. Nam at tortor in tellus interdum sagittis.
                    </p>
                  </v-card-text>
                </v-card>
              </v-window-item>
              <v-window-item :value="4">
                <v-card flat>
                  <v-card-text>
                    <p>
                      Fusce a quam. Phasellus nec sem in justo pellentesque facilisis. Nam eget dui.
                      Proin viverra, ligula sit amet ultrices semper, ligula arcu tristique sapien,
                      a accumsan nisi mauris ac eros. In dui magna, posuere eget, vestibulum et,
                      tempor auctor, justo.
                    </p>

                    <p class="mb-0">
                      Cras sagittis. Phasellus nec sem in justo pellentesque facilisis. Proin sapien
                      ipsum, porta a, auctor quis, euismod ut, mi. Donec quam felis, ultricies nec,
                      pellentesque eu, pretium quis, sem. Nam at tortor in tellus interdum sagittis.
                    </p>
                  </v-card-text>
                </v-card>
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
../../components/views/tools/documents/MyFilters.vue
