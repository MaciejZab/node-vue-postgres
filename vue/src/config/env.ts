interface ServerConfig {
  origin: string | undefined;
  port: number | undefined;
}

const nodeConfig: ServerConfig = {
  origin: "http://10.212.34.238",
  port: 3000,
};

export { nodeConfig };