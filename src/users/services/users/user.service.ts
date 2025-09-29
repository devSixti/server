import { ErrorMsg } from "../../../common/utils";
import {
  UserModel,
  DriverModel,
  DeviceModel,
  CalificationsModel,
  VehicleModel,
  DeleteRequestModel,
} from "../../models";
import { calculateProfile, getAverageCalification } from "../../utils";

/**
 * UserService centraliza la gestión del perfil de usuario
 * y la eliminación completa de la cuenta.
 * Ahora devuelve datos en vez de depender de Express.
 */
export const UserService = {
  /**
   * Obtiene el perfil de un usuario.
   */
  getUserProfile: async (uid: string, driver_uid?: string) => {
    if (!uid) {
      throw new ErrorMsg("ID de usuario requerido", 400);
    }

    const user = await UserModel.findById(uid)
      .populate("discounts")
      .populate("device")
      .populate("califications")
      .populate("driver")
      .populate("role")
      .lean();

    if (!user) {
      throw new ErrorMsg("Usuario no encontrado", 404);
    }

    let driver = null;
    if (driver_uid && user.driver) {
      driver = await DriverModel.findOne({ user_id: uid })
        .populate("vehicle_selected")
        .populate("user_info")
        .populate("wallet")
        .lean();
    }

    const averageCalification = getAverageCalification(user);
    const profilePercentage = calculateProfile(user);

    const { role, ...userToResponse } = user;
    (userToResponse as any).role_name = role?.name;

    return {
      message: driver
        ? "Perfil de conductor obtenido con éxito"
        : "Perfil de usuario obtenido con éxito",
      info: {
        isDriver: Boolean(user.driver),
        profilePercentage,
        averageCalification,
        user: driver ?? userToResponse,
      },
    };
  },

  /**
   * Envia una solicitud de eliminación de cuenta al administrador.
   */
  deleteAccount: async (uid: string) => {
    if (!uid) {
      throw new ErrorMsg("No se encontró el ID del usuario", 401);
    }
    // Verifica si el usuario existe
    const user = await UserModel.findById(uid);
    if (!user) {
      throw new ErrorMsg("Usuario no encontrado", 404);
    }
    // Verifica si ya hay una solicitud activa
    const existingRequest = await DeleteRequestModel.findOne({
      user_id: uid,
      status: "pending",
    });
    if (existingRequest) {
      throw new ErrorMsg(
        "Ya existe una solicitud de eliminación pendiente",
        400
      );
    }
    // Crea una nueva solicitud de eliminación
    const deletionRequest = await DeleteRequestModel.create({
      user_id: uid,
      reason: "Solicitud iniciada por el usuario", 
      requested_at: new Date(),
      status: "pending", 
    });
    return {
      message: "Solicitud de eliminación enviada al administrador.",
      info: {
        requestId: deletionRequest._id,
        status: deletionRequest.status,
      },
    };
  },
};
