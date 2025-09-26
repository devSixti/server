import { Document, Types } from "mongoose";  // Importar 'Types' de mongoose

export interface Wallet extends Document {
  driver_id: Types.ObjectId; // Usar 'Types.ObjectId' en lugar de 'string'
  balance: number;
  currency: string;
  createdAt?: Date;
  updatedAt?: Date;
}