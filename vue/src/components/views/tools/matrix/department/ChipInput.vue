<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { IChip } from "../../../../../interfaces/document/IChip";

const emit = defineEmits(["save-data"]);

const props = defineProps<{
  editedItem: IChip;
}>();

const item = ref<IChip>(props.editedItem);

watchEffect(() => {
  item.value = props.editedItem;
});

watchEffect(() => {
  if (item.value) {
    emit("save-data", item.value);
  }
});
</script>

<template>
  <v-text-field v-model="item.name" variant="underlined" label="Name"></v-text-field>
</template>
