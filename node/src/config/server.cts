import * as dotenv from "dotenv";
import { ServerConfig } from "../interfaces/config/ServerConfig.cjs";

dotenv.config({ path: "../../../.env" });

const serverConfig: ServerConfig = {
  port: parseInt(process.env.NODE_PORT),
  apiKey: process.env.NODE_API_KEY,
};

export { serverConfig };
