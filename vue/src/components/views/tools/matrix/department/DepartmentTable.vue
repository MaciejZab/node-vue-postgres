<script setup lang="ts">
import { ref, watch } from "vue";
import { IChips } from "../../../../../interfaces/document/IChips";
import { ILevel } from "../../../../../interfaces/document/ILevel";
import { DepartmentsManager } from "../../../../../models/document/DepartmentsManager";
import { SubcategoriesManager } from "../../../../../models/document/SubcategoriesManager";
import { CategoriesManager } from "../../../../../models/document/CategoriesManager";
// import CrudChipTable from "../../../../../components/tools/CrudChipTable.vue";
import CrudTable from "../../../../../components/tools/CrudTable.vue";
import DialogInput from "../../../../tools/DialogInput.vue";

const emit = defineEmits(["table"]);

const props = defineProps<{
  chips: IChips;
}>();

const level = ref<ILevel>(ILevel.Dep);
const manager = ref<DepartmentsManager | CategoriesManager | SubcategoriesManager>(
  new DepartmentsManager()
);

const emitTableChange = () => {
  emit("table", level.value);
};

const chips = ref<IChips>(props.chips);

const tableItem = ref<string>("Department");

watch(
  () => [props.chips?.departmentName, props.chips?.categoryName, props.chips?.subcategoryName],
  ([dep, cat, _sub]) => {
    if (cat) {
      level.value = ILevel.Sub;
      manager.value = new SubcategoriesManager();
      tableItem.value = "Workstations";
    } else if (dep) {
      level.value = ILevel.Cat;
      manager.value = new CategoriesManager();
      tableItem.value = "Programs";
    } else {
      level.value = ILevel.Dep;
      manager.value = new DepartmentsManager();
      tableItem.value = "Departments";
    }

    console.log(manager.value);

    chips.value.departmentName = dep === undefined ? "" : dep;
    chips.value.categoryName = cat === undefined ? "" : cat;
    chips.value.subcategoryName = "";
  }
);

const headers = ref<any>([
  { title: "Name", align: "start", key: "name" },
  { title: "Actions", key: "actions", sortable: false },
]);

const reqData = ref<any>(null);

const handleSaveData = (data: any) => {
  if (!data) return;
  const rd: any = {
    id: data.item.id,
    name: data.model,
    categoryName: chips.value.categoryName,
    departmentName: chips.value.departmentName,
  };

  reqData.value = rd;
};
</script>

<template>
  <!-- <crud-chip-table
    variant="departments"
    :headers="headers"
    :searchByKeys="['name']"
    :sortBy="[{ key: 'name', order: 'asc' }]"
    :toolbarTitle="tableItem"
    :manager="manager"
    :chips="chips"
    @save-data="handleSaveData"
    :req-data="reqData"
    @emit-table-change="emitTableChange"
  >
  </crud-chip-table> -->
  <crud-table
    :headers="headers"
    :sortBy="[{ key: 'name', order: 'asc' }]"
    :searchBy="['name']"
    :toolbarTitle="tableItem"
    :manager="manager"
    @save-data="handleSaveData"
    :req-data="reqData"
    :chips="chips"
    :emitTableChange="true"
    @emit-table-change="emitTableChange"
    :tableAdd="true"
    :tableDelete="true"
    :tableEdit="true"
    :tableDialogComponent="DialogInput"
    :tableDialogComponentProps="{ label: 'Name', property: 'name' }"
  >
  </crud-table>
</template>
