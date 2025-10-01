import { Request, Response, NextFunction } from "express";
import { acceptConditions } from "../services/wallet/accept.conditions.services";
import { addFunds } from "../services/wallet/add.funds.services";
import { getBalance } from "../services/wallet/get.balance.services";
import { addPaymentMethod, getPaymentMethodsByDriverId, } from "../services/wallet/payment.method.service";

/**
 * catchAsync
 * Wrapper para manejar errores de forma centralizada en controladores async
 */
const catchAsync =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

/**
 * Controlador encargado de manejar todas las operaciones relacionadas
 * con la billetera y métodos de pago de conductores
 */
export class DriverWalletController {
  /**
   * URL: POST /drivers/:driverId/accept-conditions
   * Acepta términos y condiciones para un conductor
   */
  static acceptConditions = catchAsync(async (req: Request, res: Response) => {
    const { driverId } = req.params;
    const result = await acceptConditions(driverId);
    res.json({ status: "success", data: result });
  });

  /**
   * URL: POST /drivers/:driverId/wallet/add-funds
   * Agrega fondos a la billetera del conductor
   */
  static addFunds = catchAsync(async (req: Request, res: Response) => {
    const { driverId } = req.params;
    const result = await addFunds(driverId, req.body);
    res.json({ status: "success", data: result });
  });

  /**
   * URL: GET /drivers/wallet/balance/:reference
   * Consulta el estado de una transacción y actualiza balance
   */
  static getBalance = catchAsync(async (req: Request, res: Response) => {
    const { reference } = req.params;
    const result = await getBalance(reference);
    res.json({ status: "success", data: result });
  });

  /**
   * URL: POST /drivers/:driverId/payment-methods
   * Agrega un nuevo método de pago para un conductor
   */
  static addPaymentMethod = catchAsync(async (req: Request, res: Response) => {
    const { driverId } = req.params;
    const result = await addPaymentMethod(driverId, req.body);
    res.json({ status: "success", data: result });
  });

  /**
   * URL: GET /drivers/:driverId/payment-methods
   * Obtiene todos los métodos de pago de un conductor
   */
  static getPaymentMethodsByDriverId = catchAsync(
    async (req: Request, res: Response) => {
      const { driverId } = req.params;
      const result = await getPaymentMethodsByDriverId(driverId);
      res.json({ status: "success", data: result });
    }
  );
}
