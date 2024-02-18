import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from "dotenv";

// Entities
import { Role } from "../../orm/entity/role.entity.cjs";

// Migrations
import { WithRole1708041510673 } from "../../orm/migrations/1708041510673-withRole.cjs";

dotenv.config({ path: "./../.env" });

const options: DataSourceOptions = {
  type: "postgres",
  host: process.env.HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [Role],
  migrations: [WithRole1708041510673],
};

const dataSource = new DataSource(options);

export { dataSource };
