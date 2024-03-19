<script setup lang="ts">
import { ref } from "vue";
import { DocumentEntity } from "../../../../../interfaces/document/DocumentEntity";
import { FileItem } from "../../../../../interfaces/document/FileItem";

const props = defineProps<{
  eDoc: Partial<DocumentEntity>;
  pFiles: Array<FileItem>;
}>();

const doc = ref<Partial<DocumentEntity>>(props.eDoc);
const files = ref<Array<FileItem>>(props.pFiles);
</script>

<template>
  <v-sheet border class="rounded-xl mb-4">
    <v-table>
      <thead>
        <tr>
          <th rowspan="2">Name</th>
          <th rowspan="2">Description</th>
          <th rowspan="2">Revision</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>{{ doc.name }}</td>
          <td>{{ doc.description }}</td>
          <td>{{ doc.revision }}</td>
        </tr>
      </tbody>
    </v-table>
  </v-sheet>
  <v-sheet border class="rounded-xl">
    <v-table>
      <thead>
        <tr>
          <th>File Name</th>
          <th>File Languages</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="file in files" :key="file.id">
          <td>{{ file.file?.at(0)?.name }}</td>
          <td>{{ file?.langs?.join(", ") }}</td>
        </tr>
      </tbody>
    </v-table>
  </v-sheet>
</template>
