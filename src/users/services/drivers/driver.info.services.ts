import { DriverModel } from "../../models";
import { AsyncCustomResponse } from "../../../common/types";
import { ErrorMsg } from "../../../common/utils";
import { transformVehicleData } from "../../helpers";

export const myDriverRequestInfo = async (driverId: string): AsyncCustomResponse => {
    try {
        const driver = await DriverModel.findById(driverId).populate("vehicles").populate("user_info").lean();

        if (!driver) {
            throw new ErrorMsg("Driver not found", 404);
        }   

        const vehicles = driver.vehicles ?? [];
        const firstVehicle = vehicles.length > 0
            ? vehicles.sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime())[0]
            : null;

        const { criminal_background, license, is_available, status_request } = driver;

        return {
            status: "success",
            message: `Driver found`,
            info: {
                driver: {
                    licenseFrontImage: license?.front_picture,
                    licenseBackImage: license?.back_picture,
                    licenseExpirationDate: license.expiration_date,
                    backgroundCheck: criminal_background.picture,
                    isAvailable: is_available,
                    statusRequest: status_request,
                },
                vehicle: transformVehicleData(firstVehicle),
            },
        }
    } catch (error) {
        console.error("Error in myDriverRequestInfo: ", error);
        throw error;
    }
};
