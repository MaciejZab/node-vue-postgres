import * as dotenv from "dotenv";
import { ServerConfig } from "../interfaces/config/ServerConfig.cjs";

dotenv.config({ path: "./.env" });

const serverConfig: ServerConfig = {
  host: process.env.HOST,
  origin: process.env.ORIGIN,
  port: parseInt(process.env.NODE_PORT),
  apiKey: process.env.NODE_API_KEY,
};

export { serverConfig };
