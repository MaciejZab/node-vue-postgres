import express from "express";
import cors from "cors";
// import pg from "pg";

import { corsOptionsDelegate } from "./config/cors.cjs";
import { serverConfig } from "./config/server.cjs";
// import { databaseConfig } from "./config/db.cjs";

const app = express();

app.use(cors(corsOptionsDelegate));

app.get("/", (req, res) => {
  res.send(`Hello, world!!!`); // Simple text response
});
app.post("/", (req, res) => {
  res.send(`Hello, world!!!`); // Simple text response
});

app.listen(serverConfig.port);
