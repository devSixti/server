import { Types } from "mongoose"; // Usar `Types` de Mongoose para ObjectId

export interface Discount {
    _id?: Types.ObjectId;
    user_id?: Types.ObjectId | null;
    type?: string | null;
    amount: number;
    is_active?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * Cuerpo esperado para la petición de activación de descuentos
 */
export interface ActivateDiscountBody {
  token: string;
}

/**
 * Cuerpo esperado para la petición de generación de un nuevo descuento
 */
export interface GenerateDiscountBody {
  userId: string;
  type: string;
  amount?: number;
  status?: boolean;
}