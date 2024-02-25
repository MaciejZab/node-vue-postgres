import { IPermission } from "../../interfaces/user/IPermission";

class Permission implements IPermission {
  read: boolean;
  write: boolean;
  control: boolean;

  constructor(permission: IPermission) {
    this.read = permission.read;
    this.write = permission.write;
    this.control = permission.control;
  }
}

export { Permission };
