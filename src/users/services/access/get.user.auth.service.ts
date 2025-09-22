import { calculateProfile, getAverageCalification } from "../../../users/utils";
import { AsyncCustomResponse } from "../../../common/types";
import { ErrorMsg } from "../../../common/utils";
import { DriverModel, UserModel } from "../../../users/models";

export const getUserAuth = async (
  id: string,
  isDriver: string
): AsyncCustomResponse => {
  try {
    const isDriverBool = isDriver.toLowerCase() === "true";

    const user = await UserModel.findById(id)
      .populate("discounts")
      .populate("device")
      .populate("califications")
      .populate("driver")
      .populate("role").lean();

    const driver = user?.driver && isDriverBool ?
      await DriverModel.findOne({ user_id: user!._id }).populate("vehicle_selected").populate("user_info").populate("wallet")
      : null

    if (!user) {
      throw new ErrorMsg(
        "User not found. Please check the information and try again.",
        404
      );
    }

    // Get average calification.

    const averageCalification = getAverageCalification(user);

    // Get profile coverage 

    const profilePercentage = calculateProfile(user)

    // Get user role
    const { role, ...userToResponse } = user

    userToResponse.role_name = role?.name

    return {
      message: `${!isDriverBool
        ? "Get user auth succefull."
        : "Get driver auth succefull."
        }`,
      info: {
        isDriver: user.driver ? true : false,
        profilePercentage,
        averageCalification,
        user: isDriverBool ? driver : userToResponse,
        // ...(isDriverBool
        //   ? { user, driver } 
        //   : { user }),
      },
    };
  } catch (error) {
    throw error;
  }
};
