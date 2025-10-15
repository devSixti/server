import { VehicleModel } from "../../models";
import { AsyncCustomResponse, Status } from "../../../common/types";
import { ErrorMsg } from "../../../common/utils";
import { AddOrUpdateVehicleDTO } from "../../dto";
import { transformVehicleData } from "../../helpers";
import { Vehicle } from "../../types";
import { DeleteRequestService } from "../../../admin/services";

// Agregar o actualizar vehículo
export const addOrUpdateVehicle = async ({ driverId, vehicleId, newVehicleInfo }: AddOrUpdateVehicleDTO): AsyncCustomResponse => {
  try {
    const {
      frontPropertyCard, backPropertyCard,
      pictureMandatoryInsurance, expirationDateMandatoryInsurance,
      pictureTechnicalMechanical, expirationDateTechnicalMechanical,
      frontPicture, backPicture, insidePicture,
      brand, model, year, color, capacity, fuelType, plates, type,
      submitted = false,
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
    };

    const mandatoryInsurance = {
      picture: pictureMandatoryInsurance,
      expiration_date: expirationDateMandatoryInsurance,
      verified: false,
    };

    const technicalMechanical = {
      picture: pictureTechnicalMechanical,
      expiration_date: expirationDateTechnicalMechanical,
      verified: false,
    };

    if (vehicleId) {
      const existingVehicle = await VehicleModel.findById(vehicleId);
      if (existingVehicle) {
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
          status: "success",
          message: `Vehicle updated successfully.`,
          info: {
            submitted,
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

    const newVehicle = await VehicleModel.create({
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
    });

    const transformedNewVehicle = transformVehicleData(await VehicleModel.findById(newVehicle._id).lean());

    return {
      status: "success",
      message: `Vehicle ID not found. New vehicle created.`,
      info: {
        submitted,
        statusVehicle: newVehicle.status_request,
        vehicle: transformedNewVehicle,
      },
    };
  } catch (error) {
    throw error;
  }
};

// Solicitud de eliminación de vehículo
export const deleteVehicleById = async (
  userId: string,
  vehicleId: string,
  reason: string
): AsyncCustomResponse => {
  try {
    const vehicle = await VehicleModel.findById(vehicleId);
    if (!vehicle) {
      throw new ErrorMsg("Vehicle not found", 404);
    }
    const deleteRequest = await DeleteRequestService.createDeleteRequest(
      "vehicle",
      userId,
      reason,
      vehicleId
    );

    return {
      status: "success",
      message: "Solicitud de eliminación enviada al administrador.",
      info: {
        vehicle_id: vehicle._id,
        request_id: deleteRequest._id,
        status: deleteRequest.status,
      }
    };
  } catch (error) {
    throw error;
  }
};

// ✅ Obtener vehículos del conductor
export const getDriverVehicle = async (driverId: string): AsyncCustomResponse => {
  try {
    const vehicles = await VehicleModel.find({
      driver_id: driverId,
      "property_card.verified": true,
      "mandatory_insurance.verified": true,
      "technical_mechanical.verified": true,
      status_request: Status.ACCEPTED,
    }).populate("driver");

    if (vehicles.length === 0) {
      throw new ErrorMsg(`No vehicles authorized for this driver`, 404);
    }

    return {
      status: "success",
      message: `Vehicles found`,
      info: { vehicles },
    };
  } catch (error) {
    throw error;
  }
};