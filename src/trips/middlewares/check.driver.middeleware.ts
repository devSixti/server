import { ExpressController, Status } from "../../common/types"; 
import { ErrorMsg } from "../../common/utils";
import { DriverModel } from "../../users/models"; 

// Definición de las rutas que se deben omitir de la validación de saldo, Estas rutas no requieren que el conductor tenga saldo suficiente en su billetera
const SKIP_BALANCE_CHECK_ROUTES = ["/api/wallet/add-founds"];

// Middleware para verificar que el request provenga de un driver válido
export const checkDriver: ExpressController = async (req, res, next) => {
  try {
    // Obtener el ID del conductor desde la solicitud (req.driver_uid)
    const driver_id = req.driver_uid;
    if (!driver_id) {
      throw new ErrorMsg("Debes ser conductor para acceder a este recurso.", 403);
    }

    // Buscar al conductor en la base de datos usando el `driver_id`, Se usa `.populate()` para cargar las relaciones asociadas con el conductor: información del usuario, vehículo seleccionado, y billetera
    const driver = await DriverModel.findById(driver_id)
      .populate("user_info") 
      .populate("vehicle_selected")  
      .populate("wallet"); 
    if (!driver) {
      throw new ErrorMsg(
        "No se encontró el conductor. Verifique la información y vuelva a intentarlo.",
        404
      );
    }
    // Validación del documento del conductor: verificar que tenga un `document_id` registrado
    if (
      driver.user_info?.document.document_id === null ||
      driver.user_info?.document.document_id === undefined
    ) {
      throw new ErrorMsg("El documento del conductor es obligatorio.", 400);
    }

    // Validación del saldo en la billetera del conductor
    if (
      !SKIP_BALANCE_CHECK_ROUTES.includes(req.originalUrl) &&  // Verificamos si la ruta no está en las rutas de excepción
      driver.wallet.balance <= 0  // Si el saldo del conductor es 0 o menor, lanzamos un error
    ) {
      throw new ErrorMsg(
        "El conductor no tiene suficiente saldo para proponer este precio.",
        403
      );
    }
    // Validación del estado de la solicitud del conductor, Si el estado del conductor no es "ACEPTADO", lanzamos un error
    if (driver.status_request !== Status.ACCEPTED) {
      throw new ErrorMsg(
        "La cuenta del conductor aún no ha sido aceptada. Por favor, espere la aprobación.",
        403
      );
    }
    // Si el conductor tiene un vehículo seleccionado, asignamos el `vehicle_uid` al request
    if (driver.vehicle_selected) {
      req.vehicle_uid = driver.vehicle_selected._id;
    }
    next();
  } catch (error) {
    next(error);
  }
};