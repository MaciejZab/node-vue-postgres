import PortConfig from "./PortConfig.cjs";

interface ServerConfig extends PortConfig {
  host: string;
  origin: string;
  port: number;
  apiKey: string;
}

export { ServerConfig };
