
import { Server, Socket } from 'socket.io';
import { corsValues } from "./cors.config";

export const socketConfig = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: corsValues.origin, 
      methods: corsValues.methods,
    },
    
  });

  // escuchar conexiones
  io.on("connection", (socket: Socket) => {
    console.log("🟢 Cliente conectado:", socket.id);

    // pasajero emite una solicitud de viaje
    socket.on("ride-request", (data: { from: string; to: string }) => {
      console.log("📩 Nueva solicitud de viaje:", data);

      // reenviar a todos los conductores disponibles
      io.emit("new-ride", data);
    });

    // desconexión
    socket.on("disconnect", () => {
      console.log("🔴 Cliente desconectado:", socket.id);
    });
  });

  return io;
};