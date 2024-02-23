import { defineStore } from "pinia";
import { ref } from "vue";
import { Permission } from "../intefaces/Permission";

export const usePermissionStore = defineStore("auth", () => {
  const permission = ref<Permission>({
    read: false,
    write: false,
    control: false,
  });

  const check = (routePermission: Permission): boolean => {
    const requiredPermissions = Object.entries(routePermission).filter(
      ([_, value]) => value === true
    );

    const json: string | null = localStorage.getItem("permission");
    const permission: Permission = json ? JSON.parse(json) : null;

    for (const [key, _] of requiredPermissions) {
      if (!(permission as any)[key]) return false;
    }

    return true;
  };

  const set = (userPermission: Permission): boolean => {
    try {
      permission.value.read = userPermission.read;
      permission.value.write = userPermission.write;
      permission.value.control = userPermission.control;

      localStorage.setItem("permission", JSON.stringify(permission.value));
    } catch (e) {
      return false;
    }

    return true;
  };

  return { check, set };
});
