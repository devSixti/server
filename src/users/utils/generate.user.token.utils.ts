import { generateTokens } from "../../common/utils";
import { User } from "../../users/types";

// Cambiar el tipo de retorno a un objeto con tokens
export const generateUserToken = async (
  user: User
): Promise<{ accessToken: string; refreshToken: string }> => {
  return generateTokens({ id: user._id }); 
};