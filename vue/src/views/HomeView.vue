<script setup lang="ts">
import { computed, ref } from "vue";
import weather from "../components/common/weather.vue";
import { useI18n } from "vue-i18n";
import frequentlyUsed from "../components/views/home/frequentlyUsed.vue";

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
const imgPlaceholder = "../home/welcome.jpg";
//href The card becomes an anchor with the href prop. with target="_blank" and append-icon="mdi-open-in-new"

const items = ref<Item[]>([]);

async function api(): Promise<Item[]> {
  return new Promise<Item[]>((resolve) => {
    setTimeout(() => {
      const newItems: Item[] = [
        {
          id: 1,
          title: "Lorem",
          subtitle: "Lorem Ipsum",
          imgPath: "../home/welcome.jpg",
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed accumsan leo ut tellus feugiat, ac molestie nisi mattis. Nulla facilisi. Nullam efficitur, lorem non bibendum vestibulum, lectus justo ultricies nisi, a tempus velit sem sit amet elit.",
          show: false,
        },
        {
          id: 2,
          title: "Lorem",
          subtitle: "Lorem Ipsum",
          imgPath: imgPlaceholder,
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed accumsan leo ut tellus feugiat, ac molestie nisi mattis. Nulla facilisi. Nullam efficitur, lorem non bibendum vestibulum, lectus justo ultricies nisi, a tempus velit sem sit amet elit.",
          show: false,
        },
        {
          id: 3,
          title: "Lorem",
          subtitle: "Lorem Ipsum",
          imgPath: imgPlaceholder,
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed accumsan leo ut tellus feugiat, ac molestie nisi mattis. Nulla facilisi. Nullam efficitur, lorem non bibendum vestibulum, lectus justo ultricies nisi, a tempus velit sem sit amet elit.",
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
  <v-container class="layout-view-container d-flex flex-column bg-background pt-0 mt-0">
    <v-row>
      <frequently-used />
    </v-row>
    <v-row>
      <v-col class="pt-0" :cols="boardCols">
        <v-infinite-scroll :items="items" :onLoad="load" color="secondary">
          <template v-for="item in items" :key="item.id">
            <v-card class="ma-4 bg-surface-1 text-on-surface rounded-xl">
              <v-img height="300" :src="item.imgPath" cover></v-img>

              <v-card-item>
                <v-card-title>{{ item.title }}</v-card-title>
                <v-card-subtitle>{{ item.subtitle }}</v-card-subtitle>
              </v-card-item>

              <v-card-actions class="pb-4 px-4">
                <v-btn
                  variant="outlined"
                  color="secondary"
                  class="rounded-pill"
                  @click="() => toggleDetails(item.id)"
                  :text="exploreBtn"
                />
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
  </v-container>
</template>
