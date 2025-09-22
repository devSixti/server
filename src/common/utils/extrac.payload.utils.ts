import { envValues } from "../../common/config";
import jwt from "jsonwebtoken";
import { ErrorMsg } from "./errors.message.utils";

export const extractPayload = (token: string): any => {
  try {
    if (!token) {
      throw new ErrorMsg("Please provide your access token.", 401);
    }
    const { jwt_secret: secrets } = envValues;
    const payload = jwt.verify(token, secrets!) as jwt.JwtPayload;
    return payload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new ErrorMsg("Your token has expired. Please log in again.", 401);
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new ErrorMsg("Invalid token. Please provide a valid access token.", 401);
    } else if (error instanceof jwt.NotBeforeError) {
      throw new ErrorMsg("Token is not yet active. Please check the token's validity period.", 401);
    }
    throw new ErrorMsg("An error occurred while verifying the token.", 500);
  }
};
