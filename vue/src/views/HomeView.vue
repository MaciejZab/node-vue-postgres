<script setup lang="ts">
import { computed, ref } from "vue";
import weather from "../components/weather.vue";

const smallScreen = ref<boolean>(window.innerWidth < 960);
const vRowWidth = computed((): string => (smallScreen.value ? "w-100" : "w-75"));

// const items = ref<number[]>([]);

// async function api(): Promise<number[]> {
//   return new Promise<number[]>((resolve) => {
//     setTimeout(() => {
//       resolve(Array.from({ length: 10 }, (_, i) => i + items.value[items.value.length - 1] + 1));
//     }, 1000);
//   });
// }

// async function load(): Promise<void> {
//   const newItems = await api();
//   items.value = [...items.value, ...newItems];
// }
</script>

<template>
  <v-container class="fill-height d-flex flex-column mt-3">
    <v-row :class="vRowWidth">
      <v-col>
        <weather></weather>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <!-- <v-infinite-scroll :height="300" :items="items" :onLoad="load">
          <template v-for="(item, index) in items" :key="item">
            <div :class="['pa-2', index % 2 === 0 ? 'bg-grey-lighten-2' : '']">
              Item #{{ item }}
            </div>
          </template>
        </v-infinite-scroll> -->
      </v-col>
    </v-row>
  </v-container>
</template>

<style></style>
