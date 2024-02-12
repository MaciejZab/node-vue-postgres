import express from "express";
// import pg from "pg";
// import cors from "cors";

// import { corsConfig } from "./config/cors.cjs";
// import { serverConfig } from "./config/server.cjs";
// import { databaseConfig } from "./config/db.cjs";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello, world!!!"); // Simple text response
});

// app.use(cors(corsConfig));

// app.listen(serverConfig.port);
app.listen(3000, () => console.log("Server is up and running"));
