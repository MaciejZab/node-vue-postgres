import axios from "axios";
import { Chip } from "../../interfaces/document/Chip";
import { nodeConfig } from "../../config/env";
import { Endpoints } from "../../config/Endpoints";

class CategoriesManager {
  constructor() {}

  public get = async (departmentName: string): Promise<Array<Chip>> => {
    const response = await axios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.DocumentCategory}/${departmentName}`
    );
    return response.data.got;
  };
}

export { CategoriesManager };
