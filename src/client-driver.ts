import { Server, Socket } from "socket.io";

const driverHandler = (io: Server, socket: Socket) => {
  console.log(`Conductor conectado con id: ${socket.id}`);

  // solicitud de viaje
  socket.on("nueva-solicitud", (data: any) => {
    console.log("Solicitud recibida:", data);

    // Transmitir a todos los conductores disponibles
    io.emit("solicitud-a-conductores", data);
  });

  // Manejar desconexión
  socket.on("disconnect", () => {
    console.log(`Conductor desconectado: ${socket.id}`);
  });
};

export default driverHandler;
