<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps(["drawerVisible"]);
</script>

<template>
  <v-navigation-drawer v-model="props.drawerVisible">
    <v-list-item title="Menu"></v-list-item>
    <v-divider></v-divider>
    <v-list-item link title="List Item 1"></v-list-item>
    <v-list-item link title="List Item 2"></v-list-item>
    <v-list-item link title="List Item 3"></v-list-item>
  </v-navigation-drawer>
</template>
