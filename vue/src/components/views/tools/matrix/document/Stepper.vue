<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import VerifyTables from "./VerifyTables.vue";
import FilesForm from "./FilesForm.vue";
import { FileItem } from "../../../../../interfaces/document/FileItem";
import { DocumentEntity } from "../../../../../interfaces/document/DocumentEntity";

const emit = defineEmits(["newDocData", "verified"]);

const props = defineProps<{
  editedItem: Partial<DocumentEntity>;
}>();
const smallScreen = ref<boolean>(window.innerWidth < 960);

const activeStep = ref<number>(1);
const prevStep = () => {
  if (activeStep.value > 1) {
    activeStep.value--;
  }
};
const nextStep = () => {
  if (activeStep.value < 3) {
    activeStep.value++;
  }
};
const prevable = computed(() => activeStep.value > 1);
const nextable = computed(() => activeStep.value < 3);

const document = ref<Partial<DocumentEntity>>(props.editedItem);

const files = ref<Array<FileItem>>([]);
const hasFiles = computed<boolean>(() => files.value.length > 0);
const handleFiles = (filesData: Array<FileItem>) => {
  files.value = filesData;
};

const newDocData = computed(() => {
  return {
    name: document.value.name,
    description: document.value.description,
    revision: document.value.revision,
    subcategory: null,
    competence: null,

    files: files.value,
  };
});

watchEffect(() => {
  if (
    !!document.value.name &&
    !!document.value.description &&
    !!document.value.revision &&
    hasFiles.value
  ) {
    emit("verified", false);
  } else {
    emit("verified", true);
  }
});

watchEffect(() => {
  emit("newDocData", newDocData);
});
</script>

<template>
  <v-stepper :mobile="smallScreen ? true : false" v-model="activeStep" class="rounded-xl">
    <v-stepper-header class="rounded-xl">
      <v-stepper-item
        color="secondary"
        :complete="
          activeStep > 1 && !!document.name && !!document.description && !!document.revision
        "
        :value="1"
        title="Base Info"
      ></v-stepper-item>
      <v-divider></v-divider>
      <v-stepper-item
        color="secondary"
        :complete="activeStep > 2 && hasFiles"
        :value="2"
        subtitle="One or multiple"
        title="Input Files"
      ></v-stepper-item>
      <v-divider></v-divider>
      <v-stepper-item
        color="secondary"
        :complete="activeStep > 3"
        :value="3"
        title="Verify"
      ></v-stepper-item>
    </v-stepper-header>

    <v-stepper-window>
      <v-stepper-window-item :value="1">
        <v-card flat>
          <v-text-field v-model="document.name" variant="underlined" label="Name"></v-text-field>
          <v-text-field
            v-model="document.description"
            variant="underlined"
            label="Description"
          ></v-text-field>
          <v-text-field
            v-model="document.revision"
            variant="underlined"
            label="Revision"
          ></v-text-field>
        </v-card>
      </v-stepper-window-item>

      <v-stepper-window-item :value="2">
        <v-card flat>
          <files-form @files="handleFiles"></files-form>
        </v-card>
      </v-stepper-window-item>

      <v-stepper-window-item :value="3">
        <v-card flat>
          <verify-tables :eDoc="document" :pFiles="files"></verify-tables>
        </v-card>
      </v-stepper-window-item>
    </v-stepper-window>

    <template v-slot:actions>
      <v-card-actions class="mx-6 mb-6 rounded-xl">
        <v-btn
          @click="prevStep"
          color="secondary"
          variant="text"
          class="rounded-xl"
          :disabled="!prevable"
          >Previous</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn
          @click="nextStep"
          color="secondary"
          variant="text"
          class="rounded-xl"
          :disabled="!nextable"
          >Next</v-btn
        >
      </v-card-actions>
    </template>
  </v-stepper>
</template>