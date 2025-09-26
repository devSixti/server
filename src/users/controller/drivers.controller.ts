import { driversServices } from "../../users/services";
import { ExpressController } from "../../common/types";

// ================== Gestión del Conductor ==================

export const createOrUpdateDriver: ExpressController = async (req, res, next) => {
  try {
    const id = req.uid as string;
    const newDriverInfo = req.body;
    const result = await driversServices.createOrUpdateDriver(id, newDriverInfo);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getDriverVehicle: ExpressController = async (req, res, next) => {
  try {
    const driverId = req.driver_uid as string;
    const result = await driversServices.myDriverRequestInfo(driverId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// ================== Gestión del Rol del Conductor ==================

export const changeDriverRole: ExpressController = async (req, res, next) => {
  try {
    const id = req.uid as string;
    const result = await driversServices.changeDriverAvailable(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// ================== Gestión de Disponibilidad ==================

export const changeDriverAvailable: ExpressController = async (req, res, next) => {
  try {
    const id = req.driver_uid as string;
    const result = await driversServices.changeDriverAvailable(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// ================== Información del Conductor ==================

export const myDriverRequestInfo: ExpressController = async (req, res, next) => {
  try {
    const driverId = req.driver_uid as string;
    const result = await driversServices.myDriverRequestInfo(driverId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};