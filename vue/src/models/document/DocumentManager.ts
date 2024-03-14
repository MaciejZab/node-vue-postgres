import axios from "axios";
import { nodeConfig } from "../../config/env";
import { Endpoints } from "../../config/Endpoints";

class DocumentManager {
  constructor() {}

  public post = async (formData: FormData): Promise<Array<any>> => {
    const response = await axios.post(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Document}`,
      formData
    );
    return response.data.added;
  };

  //   public get = async (_reqData?: any): Promise<Array<Chip>> => {
  //     const response = await axios.get(
  //       `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.DocumentDepartment}`
  //     );
  //     return response.data.got;
  //   };

  //   public put = async (reqData: any): Promise<Array<Chip>> => {
  //     const id: string = reqData.id;
  //     const name: string = reqData.name;
  //     const response = await axios.put(
  //       `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.DocumentDepartment}/${id}/${name}`
  //     );
  //     return response.data.edited;
  //   };

  //   public delete = async (id: number): Promise<Array<Chip>> => {
  //     const response = await axios.delete(
  //       `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.DocumentDepartment}/${id}`
  //     );
  //     return response.data.deleted;
  //   };
}

export { DocumentManager };
