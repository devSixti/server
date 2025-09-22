export interface Roles {
  name: string;
  description: string;
  is_active: boolean;
}

export enum Role {
  ADMIN = "admin",
  PASSENGER = "passenger",
  DRIVER = "driver",
}
