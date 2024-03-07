<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Chips } from "../../../../interfaces/document/Chips";
import { Chip } from "../../../../interfaces/document/Chip";
import { Level } from "../../../../interfaces/document/Level";
import { DepartmentsManager } from "../../../../models/document/DepartmentsManager";
import { CategoriesManager } from "../../../../models/document/CategoriesManager";
import { SubcategoriesManager } from "../../../../models/document/SubcategoriesManager";

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
      emitChipsChange();
    },
  },
  {
    id: 2,
    subtitle: "Category",
    chipsIf: chips.value.department,
    chips: categories.value,
    get chipsModel() {
      return chips.value.category;
    },
    set chipsModel(value) {
      chips.value.category = value;
      emitChipsChange();
    },
  },
  {
    id: 3,
    subtitle: "Subcategory",
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
  ([dep, cat, table]) => {
    const reqData: any = {
      categoryName: cat,
      departmentName: dep,
    };

    if (dep) {
      (async () => {
        try {
          categories.value = await CatManager.get(reqData);
        } catch (error) {
          console.log(error);
        }
      })();
    }
    if (cat) {
      (async () => {
        try {
          subcategories.value = await SubManager.get(reqData);
        } catch (error) {
          console.log(error);
        }
      })();
    }

    if (table !== undefined) {
      switch (table as Level) {
        case Level.Dep:
          (async () => {
            try {
              departments.value = await DepManager.get();
            } catch (error) {
              console.log(error);
            }
          })();
          break;

        case Level.Cat:
          (async () => {
            try {
              categories.value = await CatManager.get(reqData);
            } catch (error) {
              console.log(error);
            }
          })();
          break;

        case Level.Sub:
          (async () => {
            try {
              subcategories.value = await SubManager.get(reqData);
            } catch (error) {
              console.log(error);
            }
          })();
          break;

        default:
          break;
      }
    }
  }
);

const emitChipsChange = () => {
  emit("chips", chips.value);
};
</script>

<template>
  <v-card>
    <template v-for="group in chipGroups" :key="group.id">
      <v-card-text v-if="!!group.chipsIf">
        <v-card-subtitle class="text-subtitle-1">
          <v-icon>mdi-tag</v-icon> {{ group.subtitle }}
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
