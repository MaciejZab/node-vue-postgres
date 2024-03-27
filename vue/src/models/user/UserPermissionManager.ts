import axios from "axios";
import { nodeConfig } from "../../config/env";
import { Endpoints } from "../../config/Endpoints";
import { UserEntity } from "./UserEntity";

class UserPermissionManager {
  constructor() {}

  public new = () => new UserEntity();

  public get = async (): Promise<Array<any>> => {
    const response = await axios.get(`${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Users}`);
    return response.data.users;
  };

  public put = async (reqData: any): Promise<Array<any>> => {
    const response = await axios.put(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.UserPermission}`,
      reqData
    );
    return response.data.edited;
  };
}

export { UserPermissionManager };
