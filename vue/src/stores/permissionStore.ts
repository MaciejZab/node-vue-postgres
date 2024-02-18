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

  const check = (permission: Permission): boolean => {
    const requiredPermissions = Object.entries(permission).filter(([_, value]) => value === true);

    for (const [key, _] of requiredPermissions) {
      if (!(permission as any)[key]) return false;
    }

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
