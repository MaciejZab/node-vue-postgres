import axios from "axios";
import { IChip } from "../../interfaces/document/IChip";
import { nodeConfig } from "../../config/env";
import { Endpoints } from "../../config/Endpoints";
import { Chip } from "./Chip";
import { IChips } from "../../interfaces/document/IChips";

class DepartmentsManager {
  constructor() {}

  public new = () => new Chip();

  public post = async (reqData: any): Promise<Array<IChip>> => {
    console.log("reqData", reqData);
    const requestData = {
      name: reqData.name,
    };

    const response = await axios.post(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.DocumentDepartment}`,
      requestData
    );
    return response.data.added;
  };

  public get = async (_reqData?: IChips): Promise<Array<IChip>> => {
    const response = await axios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.DocumentDepartment}`
    );
    return response.data.got;
  };

  public put = async (reqData: any): Promise<Array<IChip>> => {
    const id: string = reqData.id;
    const name: string = reqData.name;
    const response = await axios.put(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.DocumentDepartment}/${id}/${name}`
    );
    return response.data.edited;
  };

  public delete = async (id: number): Promise<Array<IChip>> => {
    const response = await axios.delete(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.DocumentDepartment}/${id}`
    );
    return response.data.deleted;
  };
}

export { DepartmentsManager };
