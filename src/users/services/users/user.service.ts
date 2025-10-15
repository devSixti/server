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
import { DeleteRequestService } from "../../../admin/services"; 

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
    // Extraemos el role para saber si es admin, conductor o usuario
    const roleName = user.role?.name?.toLowerCase();

    let driver = null;
    if (driver_uid && user.driver && roleName !== "admin") {
      // Solo buscamos driver si NO es admin
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
    // Construimos la respuesta según rol
    if (roleName === "admin") {
      return {
        message: "Perfil de administrador obtenido con éxito",
        info: {
          isAdmin: true,
          profilePercentage,
          averageCalification,
          admin: userToResponse, 
        },
      };
    }

    return {
      message: driver
        ? "Perfil de conductor obtenido con éxito"
        : "Perfil de usuario obtenido con éxito",
      info: {
        isDriver: Boolean(user.driver),
        profilePercentage,
        averageCalification,
        ...(driver ? { driver } : { user: userToResponse }),
      },
    };
  },

  /**
   * Envia una solicitud de eliminación de cuenta al administrador.
   */
  deleteAccount: async (uid: string, reason = "Solicitud iniciada por el usuario") => {
    if (!uid) {
      throw new ErrorMsg("No se encontró el ID del usuario", 401);
    }
    // Verifica si el usuario existe
    const user = await UserModel.findById(uid);
    if (!user) {
      throw new ErrorMsg("Usuario no encontrado", 404);
    }
    const deleteRequest = await DeleteRequestService.createDeleteRequest(
      "user",
      uid,
      reason
    );
    return {
      message: "Solicitud de eliminación enviada al administrador.",
      info: {
        request_id: deleteRequest._id,
        status: deleteRequest.status,
      },
    };
  },
};
