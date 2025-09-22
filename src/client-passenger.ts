import { io } from "socket.io-client";

const socket = io("http://localhost:1010");

socket.on("connect", () => {
  console.log("🟢 Pasajero conectado con id:", socket.id);

  // Enviar una solicitud de viaje al servidor
  socket.emit("nueva-solicitud", {
    pasajero: "Valeria",
    origen: "Universidad",
    destino: "Casa",
  });
});

socket.on("solicitud-a-conductores", (data) => {
  console.log("🚖 El pasajero ve que la solicitud fue transmitida:", data);
});

socket.on("disconnect", () => {
  console.log("🔴 Pasajero desconectado");
});
