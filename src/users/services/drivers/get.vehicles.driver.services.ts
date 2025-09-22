import { VehicleModel } from "../../models";
import { AsyncCustomResponse, Status } from "../../../common/types";
import { ErrorMsg } from "../../../common/utils";

export const getDriverVehicle = async (driverId: string): AsyncCustomResponse => {
    try {

        const vehicles = await VehicleModel.find({
            driver_id: driverId,
            "property_card.verified": true,
            "mandatory_insurance.verified": true,
            "technical_mechanical.verified": true,
            status_request: Status.ACCEPTED
        })
            .populate("driver");

        if (vehicles.length === 0) {
            throw new ErrorMsg(`No vehicles authorized for this driver`, 404);
        }

        return {
            message: `Vehicles found`,
            info: { vehicles },
        };
    } catch (error) {
        throw error;
    }
};
