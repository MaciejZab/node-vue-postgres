import express from "express";
import cors from "cors";
// import pg from "pg";

import { corsOptionsDelegate } from "./config/cors.cjs";
import { serverConfig } from "./config/server.cjs";
import { roleRoutes } from "./routes/roleRoutes.cjs";
// import { databaseConfig } from "./config/db.cjs";

import { myDataSource } from "./config/orm/dataSource.cjs";

// establish database connection
myDataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

// create and setup express app
const app = express();
app.use(express.json());
app.use(cors(corsOptionsDelegate));

// Routes
app.use("/api/roles", roleRoutes);

app.get("/", (req, res) => {
  res.send(`Hello, world!!!`); // Simple text response
});

app.listen(serverConfig.port);
