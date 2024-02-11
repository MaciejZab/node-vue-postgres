import PortConfig from "./PortConfig.cjs";

interface ServerConfig extends PortConfig {
  apiKey: string;
}

export { ServerConfig };
