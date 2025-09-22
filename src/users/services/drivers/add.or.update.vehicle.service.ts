import { VehicleModel } from "../../models";
import { ErrorMsg } from "../../../common/utils";
import { AsyncCustomResponse, Status } from "../../../common/types";
import { Vehicle } from "../../../users/types";
import { AddOrUpdateVehicleDTO } from "../../../users/dto";
import { transformVehicleData } from "../../../users/helpers";

export const addOrUpdateVehicle = async ({ driverId, vehicleId, newVehicleInfo }: AddOrUpdateVehicleDTO): AsyncCustomResponse => {
  try {

    const {
      frontPropertyCard,
      backPropertyCard,

      pictureMandatoryInsurance,
      expirationDateMandatoryInsurance,

      submitted = false,

      pictureTechnicalMechanical,
      expirationDateTechnicalMechanical,
      frontPicture,
      backPicture,
      insidePicture,
      brand,
      model,
      year,
      color,
      capacity,
      fuelType,
      plates,
      type,
    } = newVehicleInfo;

    const pictures = {
      front_picture: frontPicture,
      back_picture: backPicture,
      inside_picture: insidePicture,
    };

    const propertyCard = {
      front_picture: frontPropertyCard,
      back_picture: backPropertyCard,
      verified: false,
    }

    const mandatoryInsurance = {
      picture: pictureMandatoryInsurance,
      expiration_date: expirationDateMandatoryInsurance,
      verified: false
    }
    const technicalMechanical = {
      picture: pictureTechnicalMechanical,
      expiration_date: expirationDateTechnicalMechanical,
      verified: false
    }

    // 🚗 Si vehicleId tiene un valor, verificamos si ya existe
    if (vehicleId) {
      const existingVehicle = await VehicleModel.findById(vehicleId);

      if (existingVehicle) {
        // Si el vehículo existe, lo actualizamos con los nuevos datos
        const updatedVehicle = await VehicleModel.findByIdAndUpdate(
          vehicleId,
          {
            driver_id: driverId,
            plates,
            type,
            property_card: propertyCard,
            mandatory_insurance: mandatoryInsurance,
            technical_mechanical: technicalMechanical,
            pictures,
            brand,
            model,
            year,
            color,
            capacity,
            fuel_type: fuelType,
            status_request: Status.PENDING,
          },
          { new: true, lean: true }
        );

        const transformedVehicle = transformVehicleData(updatedVehicle as Vehicle);

        return {
          message: `Vehicle updated successfully.`,
          info: {
            submitted: submitted || false,
            statusVehicle: updatedVehicle!.status_request,
            vehicle: transformedVehicle,
          },
        };
      }
    }

    const driverVehicles = await VehicleModel.find({ driver_id: driverId });

    if (driverVehicles.length >= 4) {
      throw new ErrorMsg("You can not add more vehicles", 409);
    }

    const newVehicleData: any = {
      driver_id: driverId,
      plates,
      type,
      property_card: propertyCard,
      mandatory_insurance: mandatoryInsurance,
      technical_mechanical: technicalMechanical,
      pictures,
      brand,
      model,
      year,
      color,
      capacity,
      fuel_type: fuelType,
      status_request: Status.PENDING,
    };

    const newVehicle = await VehicleModel.create(newVehicleData);

    const transformedNewVehicle = transformVehicleData(await VehicleModel.findById(newVehicle._id).lean());

    return {
      message: `Vehicle ID not found. New vehicle created.`,
      info: {
        submitted: submitted || false,
        statusVehicle: newVehicle.status_request,
        vehicle: transformedNewVehicle,
      },
    };
  } catch (error) {
    throw error;
  }
};
