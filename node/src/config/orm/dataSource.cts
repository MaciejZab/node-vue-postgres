import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config({ path: "./../.env" });

export const myDataSource = new DataSource({
  type: "postgres",
  // host: "localhost",
  host: process.env.HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: ["src/orm/entity/*.cts"],
  migrations: ["src/orm/migrations/*.cts"],
});
