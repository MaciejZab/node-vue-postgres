import axios from "axios";
import { nodeConfig } from "../../config/env";
import { Endpoints } from "../../config/Endpoints";
import { DocumentEntity } from "../../interfaces/document/DocumentEntity";

class DocumentManager {
  constructor() {}

  public post = async (formData: FormData): Promise<Array<DocumentEntity>> => {
    const response = await axios.post(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Document}`,
      formData
    );
    return response.data.added;
  };

  public get = async (reqData: any): Promise<Array<DocumentEntity>> => {
    let lvl: number = 0;
    if (reqData.department) lvl = 1;
    if (reqData.category) lvl = 2;
    if (reqData.subcategory) lvl = 3;

    let params: string = "";
    switch (lvl) {
      case 1:
        params = `/${reqData.department}`;
        break;
      case 2:
        params = `/${reqData.department}/${reqData.category}`;
        break;
      case 3:
        params = `/${reqData.department}/${reqData.category}/${reqData.subcategory}`;
        break;

      default:
        break;
    }

    const response = await axios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Document}${params}`
    );
    return response.data.documents;
  };

  public put = async (formData: FormData): Promise<Array<DocumentEntity>> => {
    const response = await axios.put(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Document}`,
      formData
    );
    return response.data.edited;
  };

  public delete = async (id: number): Promise<Array<DocumentEntity>> => {
    const response = await axios.delete(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Document}/${id}`
    );
    return response.data.deleted;
  };
}

export { DocumentManager };
