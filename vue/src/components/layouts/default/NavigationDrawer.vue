<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps(["drawerVisible"]);

const smallScreen = ref<boolean>(window.innerWidth < 960);

const drawerLocation = computed((): "bottom" | "left" => (smallScreen.value ? "bottom" : "left"));

// const items = [
//   {
//     title: "Foo",
//     value: "foo",
//   },
//   {
//     title: "Bar",
//     value: "bar",
//   },
//   {
//     title: "Fizz",
//     value: "fizz",
//   },
//   {
//     title: "Buzz",
//     value: "buzz",
//   },
// ];
</script>

<template>
  <v-navigation-drawer :location="drawerLocation" temporary v-model="props.drawerVisible">
    <v-list>
      <v-list-item link to="/">
        <v-list-item-icon>
          <v-icon>mdi-home</v-icon>
        </v-list-item-icon>
        <v-list-item-content>Home</v-list-item-content>
      </v-list-item>

      <v-list-item link to="/about">
        <v-list-item-icon>
          <v-icon>mdi-account</v-icon>
        </v-list-item-icon>
        <v-list-item-content>About</v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
