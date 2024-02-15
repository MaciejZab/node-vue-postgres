import * as dotenv from "dotenv";
import { ServerConfig } from "../interfaces/config/ServerConfig.cjs";

dotenv.config({ path: "./.env" });

const serverConfig: ServerConfig = {
  origin: process.env.DOMAIN,
  port: parseInt(process.env.NODE_PORT),
  apiKey: process.env.NODE_API_KEY,
};

export { serverConfig };
