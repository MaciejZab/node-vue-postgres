import axios from "axios";
import { nodeConfig } from "../../config/env";
import { Endpoints } from "../../config/Endpoints";
import { NewsEntity } from "./NewsEntity";
import { INewsEntity } from "../../interfaces/editor/INewsEntity";

class NewsManager {
  constructor() {}

  public new = () => new NewsEntity();

  public post = async (formData: FormData): Promise<Array<INewsEntity>> => {
    const response = await axios.post(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.News}`,
      formData
    );
    return response.data.added;
  };

  // public get = async (): Promise<Array<INews>> => {
  //   const response = await axios.get(`${nodeConfig.origin}:${nodeConfig.port}${Endpoints.News}`);
  //   return response.data.news;
  // };
  public get = async () => {};
}

export { NewsManager };
