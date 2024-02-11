import PortConfig from "./PortConfig.cjs";

interface DatabaseConfig extends PortConfig {
  host: string;
  database: string;
  username: string;
  password: string;
}

export { DatabaseConfig };
