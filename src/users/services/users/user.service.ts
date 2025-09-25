import { ErrorMsg } from "../../../common/utils";
import { UserModel, DriverModel, DeviceModel, CalificationsModel, VehicleModel } from "../../models";
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
   * Elimina la cuenta del usuario y datos relacionados.
   */
  deleteAccount: async (uid: string) => {
    if (!uid) {
      throw new ErrorMsg("No se encontró el ID del usuario", 401);
    }

    const userDeleted = await UserModel.deleteOne({ _id: uid });
    if (!userDeleted.deletedCount) {
      throw new ErrorMsg("Usuario no encontrado", 404);
    }

    const deviceDeleted = await DeviceModel.deleteMany({ user_id: uid });
    const driverDeleted = await DriverModel.deleteOne({ user_id: uid });
    const vehicleDeleted = await VehicleModel.deleteMany({ driver_id: uid });
    const calificationsDeleted = await CalificationsModel.deleteMany({
      from_user_id: uid,
    });

    return {
      message: "Cuenta eliminada exitosamente",
      info: {
        deleteToken: true,
        userDeleted,
        deviceDeleted,
        driverDeleted,
        vehicleDeleted,
        calificationsDeleted,
      },
    };
  },
};