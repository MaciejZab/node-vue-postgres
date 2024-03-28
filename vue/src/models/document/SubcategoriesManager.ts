import axios from "axios";
import { IChip } from "../../interfaces/document/IChip";
import { nodeConfig } from "../../config/env";
import { Endpoints } from "../../config/Endpoints";
import { Chip } from "./Chip";
import { IChips } from "../../interfaces/document/IChips";

class SubcategoriesManager {
  constructor() {}

  public new = () => new Chip();

  public post = async (reqData: any): Promise<Array<IChip>> => {
    const requestData = {
      name: reqData.name,
      departmentName: reqData.departmentName,
      categoryName: reqData.categoryName,
    };

    const response = await axios.post(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.DocumentSubcategory}`,
      requestData
    );
    return response.data.added;
  };

  public get = async (reqData: IChips): Promise<Array<IChip>> => {
    const departmentName: string = reqData.departmentName;
    const categoryName: string = reqData.categoryName;
    const response = await axios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.DocumentSubcategory}/${departmentName}/${categoryName}`
    );
    return response.data.got;
  };

  public put = async (reqData: any): Promise<Array<IChip>> => {
    const id: string = reqData.id;
    const name: string = reqData.name;
    const response = await axios.put(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.DocumentSubcategory}/${id}/${name}`
    );
    return response.data.edited;
  };

  public delete = async (id: number): Promise<Array<IChip>> => {
    const response = await axios.delete(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.DocumentSubcategory}/${id}`
    );
    return response.data.deleted;
  };
}

export { SubcategoriesManager };
