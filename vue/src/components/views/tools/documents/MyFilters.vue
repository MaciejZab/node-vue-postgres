<script setup lang="ts">
// import { ref } from "vue";

// interface DocumentsFilters {
//   program: string;
//   stand: string;
//   competences: Array<string>;
// }

const props = defineProps({
  program: {
    type: Boolean,
    default: false,
  },
  stand: {
    type: Boolean,
    default: false,
  },
});

// const filters = ref<DocumentsFilters>({ program: "", family: "", competences: [] });

// const programChips = ref<Array<string>>([""]);
// const standChips = ref<Array<string>>([""]);
// const competenceChips = ref<Array<string>>([""]);

// interface FiltersText {
//   id: number;
//   display: boolean;
//   icon: string;
//   chips: Array<string>;
// }

// const vCardTexts: Array<FiltersText> = [
//   { id: 1, display: props.program, icon: "mdi-tag", chips: [] },
//   { id: 1, display: props.stand, icon: "mdi-tag", chips: [] },
//   { id: 1, display: true, icon: "mdi-tag", chips: [] },
// ];
</script>

<template>
  <v-card>
    <v-card-text v-if="props.program">
      <v-card-subtitle class="text-subtitle-1">
        <v-icon>mdi-tag</v-icon> Competences
      </v-card-subtitle>
      <v-chip-group column color="secondary">
        <v-chip variant="outlined" filter> Project Management </v-chip>
      </v-chip-group>
    </v-card-text>
    <v-card-text v-if="props.stand">
      <v-card-subtitle class="text-subtitle-1">
        <v-icon>mdi-tag</v-icon> Competences
      </v-card-subtitle>
      <v-chip-group column color="secondary">
        <v-chip variant="outlined" filter> Project Management </v-chip>
      </v-chip-group>
    </v-card-text>
    <v-card-text>
      <v-card-subtitle class="text-subtitle-1">
        <v-icon>mdi-tag</v-icon> Competences
      </v-card-subtitle>
      <v-chip-group column multiple color="secondary">
        <v-chip variant="outlined" filter> Project Management </v-chip>
      </v-chip-group>
    </v-card-text>
  </v-card>
</template>
