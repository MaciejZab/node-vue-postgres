import express from "express";
import cors from "cors";
import "reflect-metadata";

// create and setup express app
import { corsOptionsDelegate } from "./config/cors.cjs";

const app = express();
app.use(express.json());
app.use(cors(corsOptionsDelegate));

// Routes
import { roleRoutes } from "./routes/roleRoutes.cjs";

app.use("/api/roles", roleRoutes);

// DataSource instance initialize
import { dataSource } from "./config/orm/dataSource.cjs";
import { serverConfig } from "./config/server.cjs";

dataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    app.listen(serverConfig.port, () =>
      console.log(`Node listens at ${serverConfig.origin}:${serverConfig.port}`)
    );
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
