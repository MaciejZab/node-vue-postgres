import axios from "axios";
import { nodeConfig } from "../../config/env";
import { Endpoints } from "../../config/Endpoints";
import { IDocumentEntity } from "../../interfaces/document/IDocumentEntity";
import { DocumentEntity } from "./DocumentEntity";

class DocumentManager {
  constructor() {}

  public new = () => new DocumentEntity();

  public post = async (formData: FormData): Promise<Array<IDocumentEntity>> => {
    const response = await axios.post(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Document}`,
      formData
    );
    return response.data.added;
  };

  public get = async (reqData: any): Promise<Array<IDocumentEntity>> => {
    let lvl: number = 0;
    if (reqData.departmentName) lvl = 1;
    if (reqData.categoryName) lvl = 2;
    if (reqData.subcategoryName) lvl = 3;

    let params: string = "";
    switch (lvl) {
      case 1:
        params = `/${reqData.departmentName}`;
        break;
      case 2:
        params = `/${reqData.departmentName}/${reqData.categoryName}`;
        break;
      case 3:
        params = `/${reqData.departmentName}/${reqData.categoryName}/${reqData.subcategoryName}`;
        break;

      default:
        break;
    }

    const response = await axios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Document}${params}`
    );
    return response.data.documents;
  };

  public put = async (formData: FormData): Promise<Array<IDocumentEntity>> => {
    const response = await axios.put(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Document}`,
      formData
    );
    return response.data.edited;
  };

  public delete = async (id: number): Promise<Array<IDocumentEntity>> => {
    const response = await axios.delete(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Document}/${id}`
    );
    return response.data.deleted;
  };
}

export { DocumentManager };
