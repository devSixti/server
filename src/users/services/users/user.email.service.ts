import { ErrorMsg, generateJWT, extractPayload } from "../../../common/utils";
import { UserModel } from "../../models";
import { discountsServices, commonServices } from "..";
import { updateEmailBody } from "../../../common/email";
import { verifyEmailBody } from "../../emails";

export const UserEmailService = {
  /**
   * Actualizar email de usuario
   */
  updateEmail: async (params: {
    userId: string;
    email: string;
    emailConfirmation: string;
  }) => {
    const { userId, email, emailConfirmation } = params;

    if (email !== emailConfirmation) {
      throw new ErrorMsg(
        "El email y la confirmación no coinciden. Verifica e inténtalo nuevamente.",
        400
      );
    }

    const userToUpdate = await UserModel.findById(userId).populate("discounts");
    if (!userToUpdate) throw new ErrorMsg("Usuario no encontrado", 404);

    const userUpdated = await UserModel.findByIdAndUpdate(
      userId,
      { email: { address: email, verified: false } },
      { new: true }
    ).populate("device");

    if (!userUpdated)
      throw new ErrorMsg("Error al actualizar el email del usuario.", 500);

    const { message, haveNewDiscount, newDiscount } =
      await discountsServices.generateDiscount({
        user: userToUpdate,
        type: "emailChange",
        amount: 0.15,
        status: false,
      });

    const emailVerificationToken = (await generateJWT(
      { id: userUpdated._id.toString() }, // Convertir ObjectId a string
      2592000
    )) as string;

    await commonServices.sendEmail({
      to: email,
      subject: "Verifica tu nueva dirección de correo",
      htmlBody: verifyEmailBody({ email, token: emailVerificationToken }),
    });

    let discountToken: string | undefined;
    let isEmailSended = false;
    let isSendNotification = false;

    if (newDiscount && newDiscount._id) {
      discountToken = (await generateJWT(
        { id: newDiscount._id.toString() }, // Convertir ObjectId a string
        2592000
      )) as string;

      isEmailSended = await commonServices.sendEmail({
        to: email,
        subject: "Confirmación: Tu correo ha sido actualizado",
        htmlBody: updateEmailBody({ email, token: discountToken }),
      });

      isSendNotification = await commonServices.sendNotificationToDevice({
        tokenDevice: userUpdated.device?.token ?? "",
        title: "Validación de correo",
        description: "Hemos enviado un correo para validar tu dirección.",
      });
    }

    return {
      message: [`Email actualizado a ${userUpdated.email?.address}.`, message],
      info: {
        isSendNotification,
        isEmailSended,
        haveNewDiscount,
        discountToken,
        userUpdated,
        emailVerificationToken,
      },
    };
  },

  /**
   * Verificar email del usuario
   */
  verifyEmail: async (token: string) => {
    if (!token) throw new ErrorMsg("Token requerido", 400);

    const { id } = extractPayload(token);

    const userToUpdate = await UserModel.findById(id);
    if (!userToUpdate) throw new ErrorMsg("Usuario no encontrado", 404);

    if (!userToUpdate.email?.address)
      throw new ErrorMsg("El usuario no tiene email configurado.", 400);

    const userUpdated = await UserModel.findByIdAndUpdate(
      id,
      { email: { address: userToUpdate.email.address, verified: true } },
      { new: true }
    );

    return {
      message: "Email verificado exitosamente.",
      info: { user: userUpdated },
    };
  },
};
