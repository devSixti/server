import { User } from "../../users/types";

export const userHasDevice = async (user: User, token?: string): Promise<boolean> => {
  try {
    const devices = user.device;
    if (!devices || devices) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error checking user device:", error);
    return false; 
  }
};