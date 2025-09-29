import { DriverModel, RoleModel, UserModel } from "../../models";
import { AsyncCustomResponse, Status } from "../../../common/types";
import { ErrorMsg } from "../../../common/utils";
import { Role, User } from "../../types";

// Cambiar disponibilidad del conductor
export const changeDriverAvailable = async (id: string): AsyncCustomResponse => {
  try {
    const driver = await DriverModel.findById(id).exec();

    driver?.updateOne({ is_available: !driver.is_available }).exec();

    return {
      status: "success",
      message: `Driver availability changed to ${driver?.is_available}`,
      info: { is_available: driver?.is_available },
    };
  } catch (error) {
    throw error;
  }
};

// Cambiar rol del conductor
export const changeDriverRole = async (id: string): AsyncCustomResponse => {
  try {
    const user = (await UserModel.findById(id)
      .populate("driver")
      .populate("role")) as User;

    if (!user || user?.driver?.status_request !== Status.ACCEPTED) {
      throw new ErrorMsg("User is not an approved driver", 400);
    }

    const driverRole = await RoleModel.findOne({ name: Role.DRIVER });
    const passengerRole = await RoleModel.findOne({ name: Role.PASSENGER });

    if (!driverRole || !passengerRole) {
      throw new ErrorMsg("Roles not found", 500);
    }

    const newRoleId =
      user?.role?.name === Role.DRIVER ? passengerRole.id : driverRole.id;

    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { role_id: newRoleId },
      { new: true }
    ).populate("role_id");

    return {
      status: "success",
      message: `Role changed to ${updatedUser?.role?.name}`,
      info: { role: updatedUser?.role_id },
    };
  } catch (error) {
    throw error;
  }
};
