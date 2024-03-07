import axios from "axios";
import { Chip } from "../../interfaces/document/Chip";
import { nodeConfig } from "../../config/env";
import { Endpoints } from "../../config/Endpoints";

class DepartmentsManager {
  constructor() {}

  public post = async (reqData: any): Promise<Array<Chip>> => {
    const requestData = {
      name: reqData.name,
    };

    const response = await axios.post(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.DocumentDepartment}`,
      requestData
    );
    return response.data.added;
  };

  public get = async (_reqData?: any): Promise<Array<Chip>> => {
    const response = await axios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.DocumentDepartment}`
    );
    return response.data.got;
  };

  public delete = async (id: number): Promise<Array<Chip>> => {
    const response = await axios.delete(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.DocumentDepartment}/${id}`
    );
    return response.data.deleted;
  };
}

export { DepartmentsManager };
