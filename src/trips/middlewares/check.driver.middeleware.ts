import { ExpressController, Status } from "../../common/types";
import { ErrorMsg } from "../../common/utils";
import { DriverModel } from "../../users/models";

const SKIP_BALANCE_CHECK_ROUTES = ["/api/wallet/add-founds"];

export const checkDriver: ExpressController = async (req, res, next) => {
  try {
    const driver_id = req.driver_uid;

    if (!driver_id) {
      throw new ErrorMsg("You should be a driver to access this resource", 403);
    }

    const driver = await DriverModel.findById(driver_id)
      .populate("user_info")
      .populate("vehicle_selected")
      .populate("wallet");

    if (!driver) {
      throw new ErrorMsg(
        "Driver not found. Please check the information and try again.",
        404
      );
    }

    if (
      driver.user_info?.document.document_id === null ||
      driver.user_info?.document.document_id === undefined
    ) {
      throw new ErrorMsg("Driver document is required.", 400);
    }

    if (
      !SKIP_BALANCE_CHECK_ROUTES.includes(req.originalUrl) &&
      driver.wallet.balance <= 0
    ) {
      throw new ErrorMsg(
        "Driver does not have enough balance to propose this price",
        403
      );
    }

    if (driver.status_request !== Status.ACCEPTED) {
      throw new ErrorMsg(
        "Driver account not accepted yet. Please wait for the approval.",
        403
      );
    }

    if (driver.vehicle_selected) {
      req.vehicle_uid = driver.vehicle_selected._id;
    }

    next();
  } catch (error) {
    next(error);
  }
};
