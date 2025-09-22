import { DriverModel, UserModel, VehicleModel, WalletModel } from "../../models";
import { AsyncCustomResponse, Status } from "../../../common/types";
import { CreateOrUpdateDriverDTO } from "../../../users/dto";
import { User } from "../../types";

export const createOrUpdateDriver = async (
  userId: string,
  newDriverInfo: CreateOrUpdateDriverDTO
): AsyncCustomResponse => {
  try {
    const {
      frontLicense,
      backLicense,
      expirationDate,
      pictureCriminalBackground,
    } = newDriverInfo;

    const license = {
      front_picture: frontLicense,
      back_picture: backLicense,
      expiration_date: expirationDate,
      verified: false,
    };

    const criminalBackground = {
      picture: pictureCriminalBackground,
      verified: false,
    };

    const user: User | null = await UserModel.findById(userId).populate(
      "driver"
    );

    const vehicle = await VehicleModel.findOne({
      where: { user_id: userId },
      order: [["createdAt", "ASC"]],
    });

    if (user!.driver) {
      const updateDriver = await DriverModel.findByIdAndUpdate(
        user!.driver.id,
        {
          vehicle_id: vehicle?._id,
          license: license,
          criminal_background: criminalBackground,
          status_request: Status.PENDING,
        },
        { new: true }
      );

      return {
        message: `Driver updated successfully`,
        info: {
          statusDriver: updateDriver ? true : false,
          licenseExpirationDate: updateDriver?.license.expiration_date,
          licenseBackImage: updateDriver?.license.back_picture,
          licenseFrontImage: updateDriver?.license.front_picture,
          backgroundCheck: updateDriver?.criminal_background.picture,
        },
      };
    }

    const newDriver = await DriverModel.create({
      user_id: user!._id,
      vehicle_id: vehicle?._id,
      license: license,
      criminal_background: criminalBackground,
      status_request: Status.PENDING,
    });

    // Crear la wallet asociada al nuevo conductor
    await WalletModel.create({
      driver_id: newDriver._id,
      balance: 0, // o el valor inicial que desees
      // otros campos necesarios
    });

    return {
      message: `Driver created successfully`,
      info: {
        statusDriver: newDriver ? true : false,
        licenseExpirationDate: newDriver.license.expiration_date,
        licenseBackImage: newDriver.license.back_picture,
        licenseFrontImage: newDriver.license.front_picture,
        backgroundCheck: newDriver.criminal_background.picture,
      },
    };
  } catch (error) {
    throw error;
  }
};
