<script setup>
import { ref, computed } from "vue";
const smallScreen = window.innerWidth < 960;

const slides = [
  {
    id: 1,
    text: "ISO® 9001",
  },
  {
    id: 1,
    text: "ISO® 14001",
  },
  {
    id: 1,
    text: "ISO® 45001",
  },
  {
    id: 1,
    text: "ISO® 27001",
  },
  {
    id: 1,
    text: "ISO® 22301",
  },
];
</script>

<template>
  <v-footer class="d-flex w-100">
    <div class="d-flex w-100">
      <v-carousel
        v-if="smallScreen"
        height="32"
        cycle
        :hide-delimiters="true"
        :hide-delimiter-background="true"
        :show-arrows="false"
      >
        <v-carousel-item v-for="slide in slides" :key="slide.id">
          <v-sheet color="primary" height="100%">
            <div class="d-flex fill-height justify-center align-center">
              <div>{{ slide.text }}</div>
            </div>
          </v-sheet>
        </v-carousel-item>
      </v-carousel>
      <div v-else class="d-flex w-100 justify-center align-center ga-4 bg-primary">
        <span>ISO® 9001</span>
        <span>ISO® 14001</span>
        <span>ISO® 45001</span>
        <span>ISO® 27001</span>
        <span>ISO® 22301</span>
      </div>
    </div>
  </v-footer>
</template>

<style scoped>
.v-footer {
  padding: 0;
  position: fixed;
  bottom: 0;
}
</style>
