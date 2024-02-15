import { serverConfig } from "./server.cjs";

const whitelist: Array<string> = [serverConfig.origin];
const corsOptions = {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  // allowedHeaders: ["Content-Type"],
  // exposedHeaders: ["X-Custom-Header"],
  // credentials: true,
  // maxAge: 600,
};

const corsOptionsDelegate = (req, callback) => {
  const requestApiKey: string = req.query["api-key"];
  if (requestApiKey && requestApiKey === serverConfig.apiKey) callback(null, corsOptions);
  else if (whitelist.includes(req.headers.origin)) callback(null, corsOptions);
  else callback(new Error("Not allowed by CORS, provide 'api-key' in request query."));
};

export { corsOptionsDelegate };
