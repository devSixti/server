import { UserModel } from "../../models/user.model";
import { AsyncCustomResponse } from "../../../common/types";
import { ErrorMsg, extractPayload } from "../../../common/utils";

export const verifyEmail = async (
  token: string
): AsyncCustomResponse => {
  try {
    
    // 1. Token validation

    const { id } = extractPayload(token);

    const userToUpdate = await UserModel.findById(id);

    if (!userToUpdate) {
      throw new ErrorMsg("User not found. Please check the information and try again.", 404);
    }


    // 2. Update user email status

    const userUpdated = await UserModel.findByIdAndUpdate(
        userToUpdate._id,
      {
        email: {
          address: userToUpdate?.email?.address,
          verified: true,
        }
      },
      { new: true }
    );


    return {
      message: "Verify email successfully.",
      info: { user: userUpdated },
    };
  } catch (error) {
    throw error;
  }
};
