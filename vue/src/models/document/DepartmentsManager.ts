import axios from "axios";
import { Chip } from "../../interfaces/document/Chip";
import { nodeConfig } from "../../config/env";
import { Endpoints } from "../../config/Endpoints";

class DepartmentsManager {
  constructor() {}

  public get = async (): Promise<Array<Chip>> => {
    const response = await axios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.DocumentDepartment}`
    );
    return response.data.got;
  };
}

export { DepartmentsManager };
