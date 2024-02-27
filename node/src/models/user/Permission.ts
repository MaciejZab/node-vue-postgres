import { IPermission } from "../../interfaces/user/IPermission";

class Permission implements IPermission {
  read: boolean;
  write: boolean;
  control: boolean;

  constructor(permission: IPermission | null = null) {
    this.read = permission?.read ?? true;
    this.write = permission?.write ?? false;
    this.control = permission?.control ?? false;
  }
}

export { Permission };
