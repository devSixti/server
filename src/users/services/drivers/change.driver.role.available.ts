import { DriverModel, } from "../../models";
import { AsyncCustomResponse } from "../../../common/types";

export const changeDriverAvailable = async (id: string): AsyncCustomResponse => {
  try {
    // 1. Find the driver by ID
    const driver = await DriverModel.findById(id).exec();

    // 2. Toggle the driver's availability status and update the database
    driver?.updateOne({ is_available: !driver.is_available }).exec();

    // 3. Return a response with the new availability status
    return {
      message: `Driver availability changed to ${driver?.is_available} `,
      info: { is_available: driver?.is_available},
    };
  } catch (error) {
    throw error;
  }
};
