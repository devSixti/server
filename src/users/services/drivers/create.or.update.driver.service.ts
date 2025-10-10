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

    const missingFields: string[] = [];

    // === VALIDACIONES DE CAMPOS OBLIGATORIOS DEL DRIVER ===
    if (!frontLicense) missingFields.push("La foto frontal de la licencia es obligatoria.");
    if (!backLicense) missingFields.push("La foto trasera de la licencia es obligatoria.");
    if (!expirationDate) missingFields.push("La fecha de vencimiento de la licencia es obligatoria.");
    if (!pictureCriminalBackground)
      missingFields.push("El comprobante de antecedentes judiciales es obligatorio.");

    // Validar fecha no vencida
    const expDate = new Date(expirationDate);
    if (expirationDate && expDate < new Date()) {
      missingFields.push("La fecha de vencimiento de la licencia no puede ser anterior al día actual.");
    }

    // === BUSCAR USUARIO ===
    const user: User | null = await UserModel.findById(userId).populate("driver");
    if (!user) {
      return {
        status: "error",
        message: "Usuario no encontrado.",
        info: {},
      };
    }

    // === VALIDACIONES DE DATOS DE USUARIO ===
    if (!user.first_name || !user.last_name) {
      missingFields.push("El nombre y apellido del usuario son obligatorios.");
    }

    if (!user.picture) {
      missingFields.push("La foto de perfil del usuario es obligatoria.");
    }

    if (!user.phone?.number) {
      missingFields.push("El número de teléfono del usuario es obligatorio.");
    }

    if (!user.email?.address) {
      missingFields.push("El correo electrónico es obligatorio.");
    } else if (!user.email.verified) {
      missingFields.push("El correo electrónico debe estar verificado.");
    }

    // === VALIDACIONES DE DOCUMENTO DE IDENTIDAD ===
    if (!user.document?.type) {
      missingFields.push("El tipo de documento de identidad es obligatorio.");
    }

    if (!user.document?.document_id) {
      missingFields.push("El número del documento de identidad es obligatorio.");
    }

    if (!user.document?.front_picture) {
      missingFields.push("La foto frontal del documento de identidad es obligatoria.");
    }

    if (!user.document?.back_picture) {
      missingFields.push("La foto trasera del documento de identidad es obligatoria.");
    }

   // if (!user.document?.verified) {
   //   missingFields.push("El documento de identidad debe estar verificado antes de continuar.");
   // } 

    if (missingFields.length > 0) {
      return {
        status: "error",
        message: "Error en la solicitud del conductor. Faltan datos del usuario.",
        info: { missingFields },
      };
    }

    // === VALIDAR SOLICITUD PENDIENTE ===
    if (user.driver && user.driver.status_request === Status.PENDING) {
      return {
        status: "error",
        message: "Ya tienes una solicitud pendiente de revisión.",
        info: {},
      };
    }

    // === BUSCAR VEHÍCULO ===
    const vehicle = await VehicleModel
      .findOne({ driver_id: user.driver?._id })
      .sort({ createdAt: 1 });

    // === ESTRUCTURA DE LICENCIA Y ANTECEDENTES ===
    const license = {
      front_picture: frontLicense,
      back_picture: backLicense,
      expiration_date: expDate,
      verified: false,
    };

    const criminalBackground = {
      picture: pictureCriminalBackground,
      verified: false,
    };

    // === ACTUALIZAR DRIVER EXISTENTE ===
    if (user.driver) {
      const updatedDriver = await DriverModel.findByIdAndUpdate(
        user.driver.id,
        {
          vehicle_id: vehicle?._id,
          license,
          criminal_background: criminalBackground,
          status_request: Status.PENDING,
        },
        { new: true }
      );

      return {
        status: "success",
        message: "Solicitud de conductor actualizada correctamente.",
        info: {
          statusDriver: Boolean(updatedDriver),
          licenseExpirationDate: updatedDriver?.license.expiration_date,
          licenseBackImage: updatedDriver?.license.back_picture,
          licenseFrontImage: updatedDriver?.license.front_picture,
          backgroundCheck: updatedDriver?.criminal_background.picture,
        },
      };
    }

    // === CREAR NUEVO CONDUCTOR ===
    const newDriver = await DriverModel.create({
      user_id: user._id,
      vehicle_id: vehicle?._id,
      license,
      criminal_background: criminalBackground,
      status_request: Status.PENDING,
    });

    // === CREAR WALLET ===
    await WalletModel.create({
      driver_id: newDriver._id,
      balance: 0,
    });

    return {
      status: "success",
      message: "Solicitud de conductor creada correctamente.",
      info: {
        statusDriver: newDriver.status_request === Status.ACCEPTED,
        licenseExpirationDate: newDriver.license.expiration_date,
        licenseBackImage: newDriver.license.back_picture,
        licenseFrontImage: newDriver.license.front_picture,
        backgroundCheck: newDriver.criminal_background.picture,
      },
    };
  } catch (error) {
    console.error("Error en createOrUpdateDriver:", error);
    throw error;
  }
};
