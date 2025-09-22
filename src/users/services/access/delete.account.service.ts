import { AsyncCustomResponse } from "../../../common/types";
import { ErrorMsg } from "../../../common/utils";
import { UserModel, DeviceModel, CalificationsModel, VehicleModel, DriverModel } from "../../../users/models";

export const deleteAccount = async (id: string): AsyncCustomResponse => {
  try {
    if (!id) {
      throw new ErrorMsg("We couldn’t find your user ID.", 401);
    }

    const userDeleted = await UserModel.deleteOne({ _id: id });
    const deviceDeleted = await DeviceModel.deleteMany({ user_id: id })
    const driverDeleted = await DriverModel.deleteOne({ user_id: id })
    // const vehiclesDeleted = await VehicleModel.deleteMany({ driver_id: id })
    const calificationsDeleted = await CalificationsModel.deleteMany({ from_user_id: id })

    return {
      message: `Delete account from services`,
      info: { deleteToken: true, userDeleted, deviceDeleted, calificationsDeleted, driverDeleted },
    };
  } catch (error) {
    throw error;
  }
};
