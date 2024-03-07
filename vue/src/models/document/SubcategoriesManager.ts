import axios from "axios";
import { Chip } from "../../interfaces/document/Chip";
import { nodeConfig } from "../../config/env";
import { Endpoints } from "../../config/Endpoints";

class SubcategoriesManager {
  constructor() {}

  public get = async (departmentName: string, categoryName: string): Promise<Array<Chip>> => {
    const response = await axios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.DocumentSubcategory}/${departmentName}/${categoryName}`
    );
    return response.data.got;
  };
}

export { SubcategoriesManager };
