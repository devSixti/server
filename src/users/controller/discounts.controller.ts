import { Request, Response, NextFunction } from "express";
import { activateNewDiscount } from "../services/discounts/activate.discount.service";
import { generateDiscount } from "../services/discounts/generate.discount.service";
import { ActivateDiscountBody, GenerateDiscountBody } from "../types/discount.type";
import { UserModel } from "../models"; 

/**
 * Función auxiliar para capturar errores en funciones async
 * y delegarlos al middleware global de manejo de errores.
 */
const catchAsync =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

/**
 * Controlador encargado de manejar descuentos
 */
export class DiscountController {
  /**
   * Activa un descuento a partir de un token recibido en el body
   */
  static activate = catchAsync(
    async (req: Request<{}, {}, ActivateDiscountBody>, res: Response) => {
      const { token } = req.body;

      const result = await activateNewDiscount(token);

      res.status(200).json({
        status: "exito",
        message: result.message,
        data: result.info,
        timestamp: new Date().toISOString(),
      });
    }
  );

  /**
   * Genera un nuevo descuento para un usuario
   */
  static generate = catchAsync(
    async (req: Request<{}, {}, GenerateDiscountBody>, res: Response) => {
      const { userId, type, amount, status } = req.body;

      // Buscar usuario en la base de datos
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "Usuario no encontrado",
          timestamp: new Date().toISOString(),
        });
      }

      // Delegar la lógica al servicio
      const result = await generateDiscount({ user, type, amount, status });

      res.status(200).json({
        status: "exito",
        message: result.message,
        data: result,
        timestamp: new Date().toISOString(),
      });
    }
  );
}
