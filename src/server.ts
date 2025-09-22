import cors from "cors";
import express, { Application } from "express";
import { corsValues } from "./common/config";
import appRoutes from "./routes";
import { errorsCatcher, limiter } from "./common/middlewares";

const server: Application = express();

// Middlewares
server.use(express.json());
server.use(cors(corsValues));

// Routes
server.use("/api", limiter, appRoutes);

server.use(errorsCatcher);

export default server;
