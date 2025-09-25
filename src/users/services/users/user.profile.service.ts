import { ErrorMsg } from "../../../common/utils";
import { UserModel, DeviceModel } from "../../models";
import { discountsServices } from "..";
import { commonServices } from "..";
import { User } from "../../types";

export const UserProfileService = {
  /**
   * Actualizar información personal de un usuario
   */
  updatePersonalInfo: async (
    user_id: string,
    data: {
      name?: string;
      lastName?: string;
      nickName?: string;
      birthDate?: string;
      emergencyContact?: any;
      imageUrl?: string;
      address?: string;
      phone?: any;
    }
  ) => {
    const {
      name,
      lastName,
      nickName,
      birthDate,
      emergencyContact,
      imageUrl,
      address,
      phone,
    } = data;

    const userToUpdate = (await UserModel.findById(user_id).populate(
      "discounts"
    )) as User | null;

    if (!userToUpdate) {
      throw new ErrorMsg("Usuario no encontrado", 404);
    }

    // Validar nickname único
    const userByNickname = await UserModel.findOne({ nick_name: nickName });
    if (userByNickname && userByNickname._id.toString() !== user_id) {
      throw new ErrorMsg(`El nickname ${nickName} ya está en uso.`, 409);
    }

    // Validar contacto de emergencia
    if (emergencyContact?.number && emergencyContact.number === userToUpdate.phone?.number) {
      throw new ErrorMsg("El número de emergencia no puede ser igual al número de teléfono.", 400);
    }

    // No permitir cambiar teléfono
    if (phone?.number && phone.number !== userToUpdate?.phone?.number) {
      throw new ErrorMsg("El número de teléfono ya está registrado y no puede cambiarse.", 400);
    }

    // Actualizar usuario
    const userUpdated = await UserModel.findByIdAndUpdate(
      user_id,
      {
        first_name: name,
        last_name: lastName,
        nick_name: nickName,
        birth_date: birthDate ? new Date(birthDate) : userToUpdate.birth_date,
        emergency_contact: emergencyContact,
        picture: imageUrl,
        address,
        phone: phone ?? userToUpdate.phone,
      },
      { new: true }
    );

    // Generar descuento
    const { message, haveNewDiscount } = await discountsServices.generateDiscount({
      user: userToUpdate,
      type: "emergencyContactChange",
      status: true,
    });

    return {
      message: message ? ["Usuario actualizado", message] : "Usuario actualizado",
      info: { haveNewDiscount, user: userUpdated },
    };
  },

  /**
   * Guardar documento (DNI, CC, etc.)
   */
  saveDocument: async (
    user_id: string,
    data: { type: string; documentId: string; frontPicture?: string; backPicture?: string }
  ) => {
    const { type, documentId, frontPicture, backPicture } = data;

    const user = (await UserModel.findById(user_id)) as User | null;
    if (!user) throw new ErrorMsg("Usuario no encontrado", 404);

    // Validar duplicados
    const userByDocumentId = await UserModel.findOne({
      "document.document_id": documentId,
    }) as User | null;

    if (documentId && userByDocumentId && userByDocumentId.document.document_id !== user.document.document_id) {
      throw new ErrorMsg("El documento ya está en uso.", 409);
    }

    // Validar documento verificado
    if (user.document?.verified) {
      throw new ErrorMsg("El documento ya está verificado.", 400);
    }

    // Actualizar documento
    const userUpdated = await UserModel.findByIdAndUpdate(
      user_id,
      {
        document: {
          type,
          document_id: documentId,
          front_picture: frontPicture,
          back_picture: backPicture,
          status: false,
        },
      },
      { new: true }
    );

    if (!userUpdated) {
      throw new ErrorMsg("Error al actualizar documento.", 500);
    }

    // Notificación push
    const isSendNotification = await commonServices.sendNotificationToDevice({
      tokenDevice: userUpdated.device?.token ?? "",
      title: "Document Verification",
      description: "Your document has been saved and is under review.",
    });

    // Generar descuento
    const { message, haveNewDiscount, newDiscount } = await discountsServices.generateDiscount({
      user: userUpdated,
      type: "saveDocumentChange",
      amount: 0.15,
      status: false,
    });

    return {
      message: ["Documento guardado con éxito", message],
      info: {
        isSendNotification,
        haveNewDiscount: newDiscount ? haveNewDiscount : false,
        user: userUpdated,
      },
    };
  },

  /**
   * Actualizar o crear dispositivo
   */
  updateDevice: async (user_id: string, token: string) => {
    const userDevice = await DeviceModel.findOne({ user_id });

    if (!userDevice) {
      const newDevice = await DeviceModel.create({ user_id, token });
      return { message: "Dispositivo creado", info: { device: newDevice } };
    }

    const deviceUpdated = await DeviceModel.findOneAndUpdate(
      { user_id },
      { token },
      { new: true }
    );

    return { message: "Dispositivo actualizado", info: { device: deviceUpdated } };
  },
};