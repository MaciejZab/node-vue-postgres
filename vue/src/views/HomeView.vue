<script setup lang="ts">
import { computed, ref } from "vue";
import weather from "../components/common/weather.vue";
import { useI18n } from "vue-i18n";

const smallScreen = ref<boolean>(window.innerWidth < 960);
const boardCols = computed((): number => (smallScreen.value ? 12 : 8));

interface Item {
  id: number;
  title: string;
  subtitle: string;
  imgPath: string;
  text: string;
  show: boolean;
}
const imgPlaceholder = "https://cdn.vuetifyjs.com/images/cards/cooking.png";
//href The card becomes an anchor with the href prop. with target="_blank" and append-icon="mdi-open-in-new"

const items = ref<Item[]>([]);

async function api(): Promise<Item[]> {
  return new Promise<Item[]>((resolve) => {
    setTimeout(() => {
      const newItems: Item[] = [
        {
          id: 1,
          title: "Item 1",
          subtitle: "Subtitle 1",
          imgPath: imgPlaceholder,
          text: "Text 1",
          show: false,
        },
        {
          id: 2,
          title: "Item 2",
          subtitle: "Subtitle 2",
          imgPath: imgPlaceholder,
          text: "Text 2",
          show: false,
        },
        {
          id: 3,
          title: "Item 3",
          subtitle: "Subtitle 3",
          imgPath: imgPlaceholder,
          text: "Text 3",
          show: false,
        },
      ];
      resolve(newItems);
    }, 1000);
  });
}

async function load(): Promise<void> {
  const newItems = await api();
  items.value = [...items.value, ...newItems];
}

const toggleDetails = (cardId: number) => {
  const card = items.value.find((detail) => detail.id === cardId);
  if (card) {
    card.show = !card.show;
  }
};

const computedShowValue = (itemId: number) => {
  const item = items.value.find((item) => item.id === itemId);
  return item ? item.show : false;
};

const { t } = useI18n();
const exploreBtn = computed(() => t("common.default_layout.pages.home.card.explore"));
</script>

<template>
  <v-container class="layout-view-container d-flex flex-column mt-3">
    <v-row>
      <v-col :cols="boardCols">
        <v-infinite-scroll :items="items" :onLoad="load" color="secondary">
          <template v-for="item in items" :key="item.id">
            <v-card :id="`card_${item.id}`" class="ma-4 bg-surface" elevation="6">
              <v-img
                height="300"
                src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
                cover
              ></v-img>

              <v-card-item>
                <v-card-title>{{ item.title }}</v-card-title>
                <v-card-subtitle>{{ item.subtitle }}</v-card-subtitle>
              </v-card-item>

              <v-card-actions>
                <v-btn class="bg-secondary" @click="() => toggleDetails(item.id)">{{
                  exploreBtn
                }}</v-btn>
              </v-card-actions>

              <v-expand-transition>
                <div class="details" v-show="computedShowValue(item.id)">
                  <v-divider></v-divider>

                  <v-card-text>
                    {{ item.text }}
                  </v-card-text>
                </div>
              </v-expand-transition>
            </v-card>
          </template>
        </v-infinite-scroll>
      </v-col>
      <v-col v-if="!smallScreen" cols="4">
        <weather></weather>
      </v-col>
    </v-row>
    <v-row>
      <v-col> </v-col>
    </v-row>
  </v-container>
</template>
