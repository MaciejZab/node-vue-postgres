<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { IChips } from "../../../../../interfaces/document/IChips";
import { IChip } from "../../../../../interfaces/document/IChip";
import { ILevel } from "../../../../../interfaces/document/ILevel";
import { DepartmentsManager } from "../../../../../models/document/DepartmentsManager";
import { CategoriesManager } from "../../../../../models/document/CategoriesManager";
import { SubcategoriesManager } from "../../../../../models/document/SubcategoriesManager";

const emit = defineEmits(["chips"]);

const props = defineProps<{
  table: ILevel | undefined;
}>();

const DepManager = new DepartmentsManager();
const CatManager = new CategoriesManager();
const SubManager = new SubcategoriesManager();

const chips = ref<IChips>({
  departmentName: "",
  categoryName: "",
  subcategoryName: "",
});

const departments = ref<Array<IChip> | null>(null);
const categories = ref<Array<IChip> | null>(null);
const subcategories = ref<Array<IChip> | null>(null);

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
      return chips.value.departmentName;
    },
    set chipsModel(value) {
      chips.value.departmentName = value;
      chips.value.categoryName = "";
      chips.value.subcategoryName = "";
      emitChipsChange();
    },
  },
  {
    id: 2,
    subtitle: "Program",
    chipsIf: chips.value.departmentName,
    chips: categories.value,
    get chipsModel() {
      return chips.value.categoryName;
    },
    set chipsModel(value) {
      chips.value.categoryName = value;
      chips.value.subcategoryName = "";
      emitChipsChange();
    },
  },
  {
    id: 3,
    subtitle: "Workstation",
    chipsIf: chips.value.categoryName,
    chips: subcategories.value,
    get chipsModel() {
      return chips.value.subcategoryName;
    },
    set chipsModel(value) {
      chips.value.subcategoryName = value;
      emitChipsChange();
    },
  },
]);

watch(
  () => [chips.value.departmentName, chips.value.categoryName, props.table],
  async ([dep, cat, table]) => {
    const reqData: any = { categoryName: cat, departmentName: dep };

    if (dep) categories.value = await CatManager.get(reqData);
    if (cat) subcategories.value = await SubManager.get(reqData);

    switch (table as ILevel) {
      case ILevel.Dep:
        departments.value = await DepManager.get();
        break;
      case ILevel.Cat:
        categories.value = await CatManager.get(reqData);
        break;
      case ILevel.Sub:
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
  <v-card class="rounded-xl elevation-0">
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
../../../../../interfaces/document/IChips
