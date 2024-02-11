import * as dotenv from "dotenv";
import { DatabaseConfig } from "../interfaces/config/DatabaseConfig.cjs";

dotenv.config({ path: "../../../.env" });

const databaseConfig: DatabaseConfig = {
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
};

export { databaseConfig };
