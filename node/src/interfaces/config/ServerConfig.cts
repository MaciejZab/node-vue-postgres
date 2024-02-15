import PortConfig from "./PortConfig.cjs";

interface ServerConfig extends PortConfig {
  origin: string;
  apiKey: string;
}

export { ServerConfig };
