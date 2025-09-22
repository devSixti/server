import { VehicleModel } from "../../users/models";
import { PaginationDto } from "../../common/dto";
import { AsyncCustomResponse, Status } from "../../common/types";
import { ErrorMsg, paginationResults } from "../../common/utils";
import { validateField } from "../../common/helpers";

export class VehicleService {
  //Aprobar vehículo
  static async approve(vehicleId: string): AsyncCustomResponse {
    try {
      if (!vehicleId) {
        throw new ErrorMsg("Vehicle ID is required.", 400);
      }

      const vehicle = await VehicleModel.findById(vehicleId).populate({
        path: "driver",
        populate: { path: "user_info" },
      });

      if (!vehicle) {
        throw new ErrorMsg(
          "Vehicle not found. Please check the information and try again.",
          404
        );
      }

      if (vehicle.status_request === Status.ACCEPTED) {
        throw new ErrorMsg("Vehicle has already been approved.", 400);
      }

      validateField(
        vehicle!.property_card.front_picture,
        "Vehicle front picture is required."
      );
      validateField(
        vehicle!.property_card.back_picture,
        "Vehicle back picture is required."
      );
      validateField(
        vehicle!.mandatory_insurance.picture,
        "Vehicle insurance picture is required."
      );
      validateField(
        vehicle!.mandatory_insurance.expiration_date,
        "Vehicle insurance expiration date is required."
      );
      validateField(
        vehicle!.technical_mechanical.picture,
        "Vehicle mechanical picture is required."
      );

      vehicle.status_request = Status.ACCEPTED;
      vehicle.property_card.verified = true;
      vehicle.mandatory_insurance.verified = true;
      vehicle.technical_mechanical.verified = true;

      await vehicle.save();

      return {
        message: "Vehicle approved successfully.",
        info: {
          vehicle,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  //Get all
  static async getAll(paginationDto: PaginationDto): AsyncCustomResponse {
    try {
      const { pageNumber = 1, pageSize = 10 } = paginationDto;

      const page = Number(pageNumber);
      const limit = Number(pageSize);

      const totalItems = await VehicleModel.countDocuments();

      const vehicles = await VehicleModel.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("driver");

      return {
        message: "Fetched users successfully.",
        info: {
          pagination: paginationResults({
            currentCount: vehicles.length,
            totalItems,
            currentPage: page,
            pageSize: limit,
          }),
          vehicles,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  //Get by driver id
  static async getByDriverId(driverId: string): AsyncCustomResponse {
    try {
      if (!driverId) {
        throw new ErrorMsg("Driver ID is required.", 400);
      }

      const vehicles = await VehicleModel.find({
        driver_id: driverId,
      }).populate({
        path: "driver",
        populate: {
          path: "user_info",
        },
      });

      const totalVehicles = await VehicleModel.countDocuments({
        driver_id: driverId,
      });

      return {
        message: "Fetched vehicles successfully.",
        info: {
          pagination: paginationResults({
            currentCount: vehicles.length,
            totalItems: totalVehicles,
            currentPage: 1,
            pageSize: 1,
          }),
          vehicles,
        },
      };
    } catch (error) {
      console.error("Error getting vehicles by driver ID:", error);
      throw error;
    }
  }
}
