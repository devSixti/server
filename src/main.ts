import http from "http";
import server from "./server";
import { connectDb, envValues } from "./common/config";
import { socketConfig } from "./common/config/sockets.config";
import { Socket } from "socket.io";

import driverHandler from "./client-driver"; // ajusta la ruta si tu carpeta es diferente

const main = async () => {
  try {
    const { port } = envValues;
    const app = http.createServer(server);

    // ⚡️ inicializar sockets
    const io = socketConfig(app);

    // ⚡️ manejar eventos de conexión
    io.on("connection", (socket: Socket) => {
      console.log(`🟢 Cliente conectado: ${socket.id}`);

      // registrar el handler del conductor
      driverHandler(io, socket);

      // puedes seguir teniendo otros eventos globales si quieres
      socket.on("mensaje", (msg: string) => {
        console.log("📩 Mensaje recibido:", msg);
        io.emit("mensaje", `Servidor recibió: ${msg}`);
      });

      socket.on("disconnect", () => {
        console.log(`🔴 Cliente desconectado: ${socket.id}`);
      });
    });

    await connectDb();

    app.listen(port, () => {
      console.log(`Server running at port: ${port}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

main();