import { ExpressController, Status } from "../../common/types";
import { ErrorMsg } from "../../common/utils";
import { DriverModel } from "../../users/models";

// Rutas que se deben omitir de la validación de saldo
const SKIP_BALANCE_CHECK_ROUTES = ["/api/wallet/add-founds"];

// Middleware para verificar que el request provenga de un driver válido
export const checkDriver: ExpressController = async (req, res, next) => {
  try {
    //Se obtiene el ID del driver desde la request 
    const driver_id = req.driver_uid;
    // Si no existe driver_id, significa que no es un driver autenticado
    if (!driver_id) {
      throw new ErrorMsg("You should be a driver to access this resource", 403);
    }
    // Buscar el driver en la base de datos con sus relaciones pobladas
    const driver = await DriverModel.findById(driver_id)
      .populate("user_info")
      .populate("vehicle_selected")
      .populate("wallet");

      if (!driver) {
      throw new ErrorMsg(
        "Driver not found. Please check the information and try again.",
        404
      );
    }
    //Validar que el documento del driver esté registrado
    if (
      driver.user_info?.document.document_id === null ||
      driver.user_info?.document.document_id === undefined
    ) {
      throw new ErrorMsg("Driver document is required.", 400);
    }
    //Verificar que el driver tenga saldo suficiente en la wallet, excepto en las rutas incluidas en SKIP_BALANCE_CHECK_ROUTES
    if (
      !SKIP_BALANCE_CHECK_ROUTES.includes(req.originalUrl) &&
      driver.wallet.balance <= 0
    ) {
      throw new ErrorMsg(
        "Driver does not have enough balance to propose this price",
        403
      );
    }
    // Validar que el estado del driver sea ACCEPTED
    if (driver.status_request !== Status.ACCEPTED) {
      throw new ErrorMsg(
        "Driver account not accepted yet. Please wait for the approval.",
        403
      );
    }
    //Si tiene vehículo seleccionado, se asigna el vehicle_uid al request
    if (driver.vehicle_selected) {
      req.vehicle_uid = driver.vehicle_selected._id;
    }
    next();
  } catch (error) {
    next(error);
  }
};