import { driversServices } from "../../users/services";
import { ExpressController } from "../../common/types";

export const createOrUpdateDriver: ExpressController = async (
  req,
  res,
  next
) => {
  try {
    const id = req.uid as string;
    const newDriverInfo = req.body;
    res
      .status(201)
      .json(await driversServices.createOrUpdateDriver(id, newDriverInfo));
  } catch (error) {
    next(error);
  }
};

export const addOrUpdateVehicle: ExpressController = async (req, res, next) => {
  try {
    const driverId = req.driver_uid as string;
    const newDriverInfo = req.body;
    const { vehicleId } = req.query as { vehicleId: string };
    res
      .status(201)
      .json(
        await driversServices.addOrUpdateVehicle({
          driverId: driverId,
          newVehicleInfo: newDriverInfo,
          vehicleId: vehicleId,
        })
      );
  } catch (error) {
    next(error);
  }
};

export const changeDriverRole: ExpressController = async (req, res, next) => {
  try {
    const id = req.uid as string;
    // const newDriverInfo = req.body
    res.status(200).json(await driversServices.changeDriverRole(id));
  } catch (error) {
    next(error);
  }
};

export const changeDriverAvailable: ExpressController = async (
  req,
  res,
  next
) => {
  try {
    const id = req.driver_uid as string;
    res.status(200).json(await driversServices.changeDriverAvailable(id));
  } catch (error) {
    next(error);
  }
};

export const getDriverVehicle: ExpressController = async (req, res, next) => {
  try {
    const driverId = req.driver_uid as string;
    res.status(200).json(await driversServices.getDriverVehicle(driverId));
  } catch (error) {
    next(error);
  }
};

export const assignVehicle: ExpressController = async (req, res, next) => {
  try {
    const driverId = req.driver_uid as string;
    const vehicleId = req.body.vehicle_id as string;

    if (!driverId || !vehicleId) {
      res.status(400).json({ message: "Missing driverId or vehicleId" });
    }

    res
      .status(200)
      .json(await driversServices.assignVehicle(driverId, vehicleId));
  } catch (error) {
    next(error);
  }
};

export const myDriverRequestInfo: ExpressController = async (
  req,
  res,
  next
) => {
  try {
    const driverId = req.driver_uid as string;
    res.status(200).json(await driversServices.myDriverRequestInfo(driverId));
  } catch (error) {
    next(error);
  }
};

export const deleteVehicleById: ExpressController = async (req, res, next) => {
  try {
    const { vehicleId } = req.params;
    res.status(200).json(await driversServices.deleteVehicleById(vehicleId));
  } catch (error) {
    next(error);
  }
};

export const addPaymentMethod: ExpressController = async (req, res, next) => {
  try {
    const driverId = req.driver_uid as string;
    const paymentMethod = req.body;
    res
      .status(201)
      .json(await driversServices.addPaymentMethod(driverId, paymentMethod));
  } catch (error) {
    next(error);
  }
};

export const getPaymentMethod: ExpressController = async (req, res, next) => {
  try {
    const driverId = req.driver_uid as string;
    res
      .status(200)
      .json(await driversServices.getPaymentMethodsByDriverId(driverId));
  } catch (error) {
    next(error);
  }
};
