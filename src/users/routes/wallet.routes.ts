import { Router } from "express";
import { walletControllers } from "../controller";
import { isAuth } from "../../common/middlewares";

const router = Router();
router.use(isAuth); 

// Aceptar condiciones
router.post("/accept-conditions", walletControllers.DriverWalletController.acceptConditions);
// Agregar fondos
router.post("/add-funds", walletControllers.DriverWalletController.addFunds);
// Consultar balance
router.get("/wallet/balance/:reference", walletControllers.DriverWalletController.getBalance);
// Métodos de pago
router.post("/payment-methods", walletControllers.DriverWalletController.addPaymentMethod);
router.get("/payment-methods", walletControllers.DriverWalletController.getPaymentMethodsByDriverId);

export default router;
