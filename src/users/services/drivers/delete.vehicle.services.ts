import { VehicleModel } from "../../models";
import { AsyncCustomResponse } from "../../../common/types";
import { ErrorMsg } from "../../../common/utils";

export const deleteVehicleById = async (vehicleId: string): AsyncCustomResponse => {
    try {

        const vehicle = await VehicleModel.findById(vehicleId);

        if (!vehicle) {
            throw new ErrorMsg("Vehicle not found", 404);
        }

        await VehicleModel.findByIdAndDelete(vehicle._id);

        return {
            message: `Vehicle deleted`,
            info: {
                vehicle: vehicle
            }
        };

    } catch (error) {
        throw error;
    }
};
