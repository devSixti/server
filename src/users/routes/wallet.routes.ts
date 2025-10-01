import { Router } from "express";
import { walletControllers } from "../controller";

const router = Router();

// Aceptar condiciones
router.post("/:driverId/accept-conditions", walletControllers.DriverWalletController.acceptConditions);

// Agregar fondos
router.post("/:driverId/wallet/add-funds", walletControllers.DriverWalletController.addFunds);

// Consultar balance
router.get("/wallet/balance/:reference", walletControllers.DriverWalletController.getBalance);

// Métodos de pago
router.post("/:driverId/payment-methods", walletControllers.DriverWalletController.addPaymentMethod);
router.get("/:driverId/payment-methods", walletControllers.DriverWalletController.getPaymentMethodsByDriverId);

export default router;
