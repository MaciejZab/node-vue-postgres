import express from "express";
import cors from "cors";
// import pg from "pg";

import { corsOptionsDelegate } from "./config/cors.cjs";
import { serverConfig } from "./config/server.cjs";
import { roleRoutes } from "./routes/roleRoutes.cjs";
// import { databaseConfig } from "./config/db.cjs";

const app = express();

app.use(cors(corsOptionsDelegate));

// Routes
app.use("/api/roles", roleRoutes);

app.get("/", (req, res) => {
  res.send(`Hello, world!!!`); // Simple text response
});

app.listen(serverConfig.port);
