import { serverConfig } from "./server.cjs";
import * as dotenv from "dotenv";

dotenv.config({ path: "../../../.env" });

const whitelist: Array<string> = [process.env.DOMAIN];

const corsConfig: unknown = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin)) callback(null, true);
    else {
      const queryParams: URLSearchParams = new URLSearchParams(origin);
      const apiKey: string = queryParams.get("apiKey");

      if (apiKey && apiKey === serverConfig.apiKey) callback(null, true);
      else if (apiKey) callback(new Error("Not allowed by CORS, invalid apiKey"));
      else if (!apiKey) callback(new Error("Not allowed by CORS, api key is required to access API from your origin"));
    }
  },
};

export { corsConfig };
