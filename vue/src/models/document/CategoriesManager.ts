import axios from "axios";
import { IChip } from "../../interfaces/document/IChip";
import { nodeConfig } from "../../config/env";
import { Endpoints } from "../../config/Endpoints";

class CategoriesManager {
  constructor() {}

  public post = async (reqData: any): Promise<Array<IChip>> => {
    const requestData = {
      name: reqData.name,
      departmentName: reqData.departmentName,
    };

    const response = await axios.post(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.DocumentCategory}`,
      requestData
    );
    return response.data.added;
  };

  public get = async (reqData: any): Promise<Array<IChip>> => {
    const departmentName: string = reqData.departmentName;
    const response = await axios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.DocumentCategory}/${departmentName}`
    );
    return response.data.got;
  };

  public put = async (reqData: any): Promise<Array<IChip>> => {
    const id: string = reqData.id;
    const name: string = reqData.name;
    const response = await axios.put(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.DocumentCategory}/${id}/${name}`
    );
    return response.data.edited;
  };

  public delete = async (id: number): Promise<Array<IChip>> => {
    const response = await axios.delete(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.DocumentCategory}/${id}`
    );
    return response.data.deleted;
  };
}

export { CategoriesManager };
