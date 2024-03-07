<script setup lang="ts">
import axios from "axios";
import { computed, ref, watch } from "vue";
import { nodeConfig } from "../../../../config/env";
import { Endpoints } from "../../../../config/Endpoints";
import { Chips } from "../../../../interfaces/document/Chips";
import { Chip } from "../../../../interfaces/document/Chip";
import { Level } from "../../../../interfaces/document/Level";

const emit = defineEmits(["chips"]);

const props = defineProps<{
  table: Level | undefined;
}>();

const chips = ref<Chips>({
  department: "",
  category: "",
  subcategory: "",
});

const getDepartments = async (): Promise<Array<Chip> | null> => {
  const response = await axios.get(
    `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.DocumentDepartment}`
  );
  return response.data.got;
};

const departments = ref<Array<Chip> | null>(null);
const categories = ref<Array<Chip> | null>(null);
const subcategories = ref<Array<Chip> | null>(null);

(async () => {
  try {
    departments.value = await getDepartments();
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

const getCategories = async (departmentName: string): Promise<Array<Chip> | null> => {
  const response = await axios.get(
    `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.DocumentCategory}/${departmentName}`
  );
  return response.data.got;
};

const getSubcategories = async (
  departmentName: string,
  categoryName: string
): Promise<Array<Chip> | null> => {
  const response = await axios.get(
    `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.DocumentSubcategory}/${departmentName}/${categoryName}`
  );
  return response.data.got;
};

watch(
  () => [chips.value.department, chips.value.category, props.table],
  ([dep, cat, table]) => {
    if (dep) {
      (async () => {
        try {
          categories.value = await getCategories(dep as string);
        } catch (error) {
          console.log(error);
        }
      })();
    }
    if (cat) {
      (async () => {
        try {
          subcategories.value = await getSubcategories(dep as string, cat as string);
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
              departments.value = await getDepartments();
            } catch (error) {
              console.log(error);
            }
          })();
          break;

        case Level.Cat:
          (async () => {
            try {
              categories.value = await getCategories(dep as string);
            } catch (error) {
              console.log(error);
            }
          })();
          break;

        case Level.Sub:
          (async () => {
            try {
              subcategories.value = await getSubcategories(dep as string, cat as string);
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
