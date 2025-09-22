import { ExpressController } from "common/types";

/**
 * Controlador de health check.
 * Responde con un mensaje simple para indicar que el servicio está activo.
 * @route GET /health
 * @returns {Object} Mensaje de estado del servicio
 */
export const healthCheck: ExpressController = async (req, res, next) => {
  try {
    // Devuelve una respuesta HTTP 200 con un mensaje de estado
    res.status(200).json({ message: "Xisti ok" });
  } catch (error) {
    // En caso de error, se pasa al middleware de manejo de errores
    next(error);
  }
};
