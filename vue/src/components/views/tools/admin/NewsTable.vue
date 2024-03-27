<script setup lang="ts">
import { ref } from "vue";
import AddEditTable from "../../../../components/tools/AddEditTable.vue";
// import CrudTable from "../../../../components/tools/CrudTable.vue";
import { NewsManager } from "../../../../models/editor/NewsManager";
import CkEditor from "../../../common/CkEditor.vue";
const emit = defineEmits(["table"]);

const headers: any = [
  { title: "Title", align: "start", key: "title" },
  { title: "Subtitle", key: "subtitle" },
  { title: "Actions", key: "actions", sortable: false },
];

const reqData = ref<any>(null);

const handleSaveData = (data: any) => {
  if (!data) return;

  console.log(data);
  // const user: IUser = {
  //   id: data.item.id,
  //   username: data.item.username,
  //   domain: data.item.domain,
  // };

  // const permission: IPermission = new Permission(data.model);

  // reqData.value = { user, permission };
};

const manager = new NewsManager();
</script>

<template>
  <add-edit-table
    :headers="headers"
    :searchByKeys="['title', 'subtitle']"
    :sortBy="[{ key: 'title', order: 'asc' }]"
    toolbarTitle="News"
    :manager="manager"
    @save-data="handleSaveData"
    :req-data="reqData"
  >
    <template v-slot:table-dialog-slot>
      <ck-editor @save-data="handleSaveData"></ck-editor>
    </template>
  </add-edit-table>

  <!-- <crud-table
    :headers="headers"
    :searchBy="['title', 'subtitle']"
    :sortBy="[{ key: 'title', order: 'asc' }]"
    toolbarTitle="News"
    :manager="manager"
    @save-data="handleSaveData"
    :req-data="reqData"
    :tableEdit="true"
  >
    <template v-slot:table-dialog-slot>
      <ck-editor @save-data="handleSaveData"></ck-editor>
    </template>
  </crud-table> -->
</template>
