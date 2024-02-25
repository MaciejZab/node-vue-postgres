import { IPermission } from "../../interfaces/user/IPermission";

class Permission implements IPermission {
  read: boolean;
  write: boolean;
  control: boolean;

  constructor(read: boolean, write: boolean, control: boolean) {
    this.read = read;
    this.write = write;
    this.control = control;
  }
}

export { Permission };
