import { DriverModel, VehicleModel } from "../../models";
import { AsyncCustomResponse, Status } from "../../../common/types";
import { ErrorMsg } from "../../../common/utils";

export const assignVehicle = async (
  driverId: string,
  vehicleId: string
): AsyncCustomResponse => {
  try {
    const vehicle = await VehicleModel.findOne({
      _id: vehicleId,
      driver_id: driverId,
      "property_card.verified": true,
      "mandatory_insurance.verified": true,
      "technical_mechanical.verified": true,
      status_request: Status.ACCEPTED,
    });

    if (!vehicle) {
      throw new ErrorMsg(`No vehicles authorized for this driver`, 404);
    }

    const driver = await DriverModel.findByIdAndUpdate(
      driverId,
      { vehicle_id: vehicleId },
      { new: true }
    ).populate("vehicle_selected");

    return {
      message: `Vehicle assigned to driver`,
      info: { driver },
    };
  } catch (error) {
    throw error;
  }
};
