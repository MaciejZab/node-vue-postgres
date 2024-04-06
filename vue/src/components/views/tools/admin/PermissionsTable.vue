<script setup lang="ts">
import { ref } from "vue";
// import EditTable from "../../../../components/tools/EditTable.vue";
import CrudTable from "../../../../components/tools/CrudTable.vue";
import DialogInput from "../../../tools/DialogInput.vue";
import { UserPermissionManager } from "../../../../models/user/UserPermissionManager";
import { IUser } from "../../../../interfaces/user/IUser";
import { IPermission } from "../../../../interfaces/user/IPermission";
import { Permission } from "../../../../models/user/Permission";

const emit = defineEmits(["table"]);

const headers: any = [
  { title: "Username", align: "start", key: "username" },
  { title: "Domain", key: "domain" },
  { title: "Permission", key: "custom", sortable: false },
  { title: "Actions", key: "actions", sortable: false },
];

const reqData = ref<any>(null);

const handleSaveData = (data: any) => {
  if (!data) return;

  const user: IUser = {
    id: data.item.id,
    username: data.item.username,
    domain: data.item.domain,
  };

  const permission: IPermission = new Permission(data.model);

  reqData.value = { user, permission };
};

const manager = new UserPermissionManager();

const permission = (item: any) => {
  const { id, ...permissionWithoutId } = item.permission;
  const p: IPermission = permissionWithoutId;
  if (p.control) return "Admin";
  if (p.write) return "Moderator";
  else return "User";
};
</script>

<template>
  <crud-table
    :headers="headers"
    :sortBy="[{ key: 'username', order: 'asc' }]"
    :searchBy="['username', 'domain']"
    toolbarTitle="Permissions"
    :manager="manager"
    @save-data="handleSaveData"
    :req-data="reqData"
    :tableEdit="true"
    :tableDialogComponent="DialogInput"
    :tableDialogComponentProps="{ label: 'Permission', items: ['User', 'Moderator', 'Admin'] }"
  >
    <template v-slot:table-key-slot="{ item }">
      <span class="text-body-2">{{ permission(item) }}</span>
    </template>
  </crud-table>
</template>