<script setup lang="ts">
import { ref } from "vue";
import CrudTable from "../../../../components/tools/CrudTable.vue";

const emit = defineEmits(["table"]);

const headers: any = [
  { title: "Name", align: "start", key: "name" },
  { title: "Surname", key: "surname" },
  { title: "Privileges", key: "privileges", sortable: false },
];

const reqData = ref<any>(null);

const handleSaveData = (data: any) => {
  if (!data) return;

  const rd: any = {
    id: data.id,
    privileges: data.privileges,
  };

  reqData.value = rd;
};

const manager = new UserPrivilegesManager();
</script>

<template>
  <crud-table
    :headers="headers"
    :searchByKeys="['name', 'description']"
    :sortBy="[{ key: 'name', order: 'asc' }]"
    toolbarTitle="Privileges"
    :manager="manager"
    @save-data="handleSaveData"
    :req-data="reqData"
  >
  </crud-table>
</template>
