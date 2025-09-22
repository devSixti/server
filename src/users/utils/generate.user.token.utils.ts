import { generateJWT } from "../../common/utils";
import { User } from "../../users/types";

export const generateUserToken = async (user: User): Promise<string> => {
    if (user?.driver) {
      return await generateJWT({ id: user._id }, 1296000);
    } else {
      return await generateJWT({ id: user._id });
    }
  };