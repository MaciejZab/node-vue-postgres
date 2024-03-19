<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Chips } from "../../../../../interfaces/document/Chips";
import { Chip } from "../../../../../interfaces/document/Chip";
import { Level } from "../../../../../interfaces/document/Level";
import { DepartmentsManager } from "../../../../../models/document/DepartmentsManager";
import { CategoriesManager } from "../../../../../models/document/CategoriesManager";
import { SubcategoriesManager } from "../../../../../models/document/SubcategoriesManager";

const emit = defineEmits(["chips"]);

const props = defineProps<{
  table: Level | undefined;
}>();

const DepManager = new DepartmentsManager();
const CatManager = new CategoriesManager();
const SubManager = new SubcategoriesManager();

const chips = ref<Chips>({
  department: "",
  category: "",
  subcategory: "",
});

const departments = ref<Array<Chip> | null>(null);
const categories = ref<Array<Chip> | null>(null);
const subcategories = ref<Array<Chip> | null>(null);

(async () => {
  try {
    departments.value = await DepManager.get();
  } catch (error) {
    console.log(error);
  }
})();

const chipGroups = computed(() => [
  {
    id: 1,
    subtitle: "Department",
    chipsIf: departments.value,
    chips: departments.value,
    get chipsModel() {
      return chips.value.department;
    },
    set chipsModel(value) {
      chips.value.department = value;
      chips.value.category = "";
      chips.value.subcategory = "";
      emitChipsChange();
    },
  },
  {
    id: 2,
    subtitle: "Program",
    chipsIf: chips.value.department,
    chips: categories.value,
    get chipsModel() {
      return chips.value.category;
    },
    set chipsModel(value) {
      chips.value.category = value;
      chips.value.subcategory = "";
      emitChipsChange();
    },
  },
  {
    id: 3,
    subtitle: "Workstation",
    chipsIf: chips.value.category,
    chips: subcategories.value,
    get chipsModel() {
      return chips.value.subcategory;
    },
    set chipsModel(value) {
      chips.value.subcategory = value;
      emitChipsChange();
    },
  },
]);

watch(
  () => [chips.value.department, chips.value.category, props.table],
  async ([dep, cat, table]) => {
    const reqData: any = { categoryName: cat, departmentName: dep };

    if (dep) categories.value = await CatManager.get(reqData);
    if (cat) subcategories.value = await SubManager.get(reqData);

    switch (table as Level) {
      case Level.Dep:
        departments.value = await DepManager.get();
        break;
      case Level.Cat:
        categories.value = await CatManager.get(reqData);
        break;
      case Level.Sub:
        subcategories.value = await SubManager.get(reqData);
        break;
    }
  }
);

const emitChipsChange = () => {
  emit("chips", chips.value);
};
</script>

<template>
  <v-card class="rounded-xl elevation-2">
    <template v-for="(group, index) in chipGroups" :key="group.id">
      <v-card-text v-if="!!group.chipsIf" :class="index !== 0 ? 'pt-0' : ''">
        <v-card-subtitle class="text-subtitle-1">
          <v-icon size="20">mdi-tag</v-icon> {{ group.subtitle }}
        </v-card-subtitle>
        <v-chip-group v-model="group.chipsModel" column color="secondary">
          <v-chip
            v-for="department in group.chips"
            :key="department.id"
            :value="department.name"
            variant="outlined"
            filter
          >
            {{ department.name }}
          </v-chip>
        </v-chip-group>
      </v-card-text>
    </template>
  </v-card>
</template>
