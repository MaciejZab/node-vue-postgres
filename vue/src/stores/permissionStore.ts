import { defineStore } from "pinia";
import { ref } from "vue";
import { IPermission } from "../interfaces/user/IPermission";

export const usePermissionStore = defineStore("auth", () => {
  const permission = ref<IPermission>({
    read: false,
    write: false,
    control: false,
  });

  const check = (routePermission: IPermission): boolean => {
    const requiredPermission = Object.entries(routePermission).filter(
      ([_, value]) => value === true
    );
    // console.log("requiredPermission", requiredPermission);

    const json: string | null = localStorage.getItem("permission");
    const permission: IPermission = json ? JSON.parse(json) : null;
    // console.log("permission", permission);

    for (const [key, _] of requiredPermission) {
      if (!(permission as any)[key]) return false;
    }

    return true;
  };

  const set = (userPermission: IPermission): boolean => {
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
