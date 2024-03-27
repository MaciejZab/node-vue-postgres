import axios from "axios";
import { nodeConfig } from "../../config/env";
import { Endpoints } from "../../config/Endpoints";
import { NewsEntity } from "./NewsEntity";
import { INews } from "../../interfaces/editor/INews";

class NewsManager {
  constructor() {}

  public new = () => new NewsEntity();

  public post = async (formData: FormData): Promise<Array<INews>> => {
    const response = await axios.post(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.News}`,
      formData
    );
    return response.data.added;
  };

  public get = async (): Promise<Array<INews>> => {
    const response = await axios.get(`${nodeConfig.origin}:${nodeConfig.port}${Endpoints.News}`);
    return response.data.news;
  };
}

export { NewsManager };
