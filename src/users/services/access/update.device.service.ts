import { userHasDevice } from "./../../utils/user.has.device.utils";
import { AsyncCustomResponse } from "../../../common/types";
import { DeviceModel } from "../../../users/models";

export const updateDevice = async (
  id: string,
  deviceInfo: any
): AsyncCustomResponse => {
  try {
    // 1. Destructure device information from the input
    const { token } = deviceInfo;

    // 2. checkif user has a device

    const userHasDevice = await DeviceModel.findOne({ user_id: id });

    if (!userHasDevice) {
      const newDevice = await DeviceModel.create({
        user_id: id,
        token,
      });

      return {
        message: [`Device created.`],
        info: { device: newDevice },
      };
    }

    // 3. update a new device for the user
    const deviceUpdated = await DeviceModel.updateOne({
      user_id: id,
      token: token,
    });


    return {
      message: [`Device updated.`],
      info: { device: deviceUpdated },
    };
  } catch (error) {
    throw error;
  }
};
