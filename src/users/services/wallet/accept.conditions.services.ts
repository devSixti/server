import { ErrorMsg } from "../../../common/utils";
import { envValues } from "../../../common/config";
import { AsyncCustomResponse } from "../../../common/types";

export const acceptConditions = async (
  driverId?: string
): AsyncCustomResponse => {
  try {
    // Validar que el driverId corresponda a un conductor existente
    const { DriverModel, WalletModel } = require("../../models");
    if (!driverId) {
      throw new ErrorMsg("driverId is required", 400);
    }
    const driver = await DriverModel.findById(driverId);
    if (!driver) {
      throw new ErrorMsg("Driver not found", 404);
    }
    let wallet = await WalletModel.findOne({ driver_id: driverId });
    // Si no existe, crear una nueva wallet
    if (!wallet) {
      wallet = await WalletModel.create({
        driver_id: driverId,
        balance: 0,
        currency: "COP",
      });
    }
    const response = await fetch(
      `${envValues.wompi_api_url}/merchants/${envValues.wompi_api_public_key}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new ErrorMsg(
        `Error fetching data: ${response.status} ${response.statusText}`,
        500
      );
    }

    const { data } = await response.json();

    return {
      message: `Request successful`,
      info: {
        driverId,
        wompiResponse: data,
        // presigned_acceptance

        acceptanceToken: data.presigned_acceptance.acceptance_token,
        acceptancePermalink: data.presigned_acceptance.permalink,

        // presigned_personal_data_auth
        authAcceptanceToken: data.presigned_personal_data_auth.acceptance_token,
        authPermalink: data.presigned_personal_data_auth.permalink,
      },
    };
  } catch (error) {
    throw error;
  }
};
