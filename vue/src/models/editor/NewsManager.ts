import axios from "axios";
import { nodeConfig } from "../../config/env";
import { Endpoints } from "../../config/Endpoints";
import { NewsEntity } from "./NewsEntity";
import { INewsEntity } from "../../interfaces/editor/INewsEntity";
import { usePermissionStore } from "../../stores/permissionStore";

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

  public put = async (formData: FormData): Promise<Array<INewsEntity>> => {
    const response = await axios.put(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.News}`,
      formData
    );
    return response.data.edited;
  };

  public get = async (
    permission: boolean = false,
    skip: number = 0,
    take: number = 0
  ): Promise<Array<INewsEntity>> => {
    const permissionStore = usePermissionStore();

    const code: "user" | "moderator" | "admin" = permission
      ? (permissionStore.getPermissionCode() as "user" | "moderator" | "admin")
      : "admin";
    const response = await axios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.News}/${code}/${skip}/${take}`
    );
    return response.data.news;
  };

  public delete = async (id: number): Promise<Array<INewsEntity>> => {
    const response = await axios.delete(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.News}/${id}`
    );
    return response.data.deleted;
  };
}

export { NewsManager };
