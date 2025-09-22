import { Role } from "../../src/users/types";

export const roles = [
  {
    name: Role.ADMIN,
    description: 'Usuario con permisos administrativos.',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: Role.PASSENGER,
    description: 'Usuario que utiliza el servicio como pasajero.',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: Role.DRIVER,
    description: 'Usuario que proporciona el servicio de transporte.',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
];

// ...existing code...
