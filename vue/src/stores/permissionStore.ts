import { defineStore } from "pinia";
import { ref } from "vue";

export const usePermissionStore = defineStore("auth", () => {
  interface Permission {
    read: boolean;
    write: boolean;
    control: boolean;
  }

  const permission = ref<Permission>({
    read: false,
    write: false,
    control: false,
  });

  const check = (routePermission: Permission): boolean => {
    if (permission.value.read !== routePermission.read) return false;
    if (permission.value.write !== routePermission.write) return false;
    if (permission.value.control !== routePermission.control) return false;

    return true;
  };

  const change = (userPermission: Permission): boolean => {
    try {
      permission.value.read = userPermission.read;
      permission.value.write = userPermission.write;
      permission.value.control = userPermission.control;
    } catch (e) {
      return false;
    }

    return true;
  };

  return { check, change };
});
