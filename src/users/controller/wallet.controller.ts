import { ExpressController } from "../../common/types";
import { walletServices } from "../../users/services";

export const addFunds: ExpressController = async (req, res, next) => {
  try {
    const driverId = req.driver_uid as string;
    const userData = req.body;
    res.status(201).json(await walletServices.addFunds(driverId, userData));
  } catch (error) {
    next(error);
  }
};

export const acceptConditions: ExpressController = async (req, res, next) => {
  try {
    const { driverId } = req.body;
    res.status(200).json(await walletServices.acceptConditions(driverId));
  } catch (error) {
    next(error);
  }
};

export const getBalance: ExpressController = async (req, res, next) => {
  try {
    const { reference: transaccionReference } = req.query as { reference?: string };
    res.status(200).json(await walletServices.getBalance(transaccionReference));
  } catch (error) {
    next(error);
  }
}