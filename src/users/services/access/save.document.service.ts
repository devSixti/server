import { ErrorMsg } from "../../../common/utils";
import { AsyncCustomResponse } from "../../../common/types";
import { User } from "../../../users/types";
import { UserModel } from "../../../users/models";
import { commonServices, discountsServices } from "..";

interface SaveDocumetDto {
  type: string;
  documentId: string;
  frontPicture: string;
  backPicture: string;
}

export const saveDocument = async (
  id: string,
  documentInfo: SaveDocumetDto
): AsyncCustomResponse => {
  try {
    const { type, documentId, frontPicture, backPicture } = documentInfo;

    // 1. Buscar si un usuario ya tiene el mismo código de documento
    const userByDocumentId: User | null = await UserModel.findOne({
      "document.document_id": documentId,
    });

    // 2. Buscar el usuario actual por su ID
    const user = (await UserModel.findById(id)) as User | null;

    // 3. Si el usuario no se encuentra, lanzar un error
    if (!user) {
      throw new ErrorMsg(
        "User not found. Please check the information and try again.",
        404
      );
    }
    
    // 4. Validar que ningún otro usuario tenga el mismo código de documento
    if ((documentId != null || documentId != undefined) && (userByDocumentId && userByDocumentId.document.document_id != user.document.document_id)) {
      throw new ErrorMsg("The document code is already in use.", 409);
    }

    // 5. Validar que el documento no esté ya asignado y verificado
    if (user.document?.verified) {
      throw new ErrorMsg("The document is already assigned to this user.", 400);
    }

    // 6. Actualizar el documento del usuario
    const userUpdated = await UserModel.findByIdAndUpdate(
      id,
      {
        document: {
          type: type,
          document_id: documentId,
          front_picture: frontPicture,
          back_picture: backPicture,
          status: false,
        },
      },
      { new: true }
    );

    // 7. Si la actualización falla, lanzar un error
    if (!userUpdated) {
      throw new ErrorMsg("Failed to update user's document.", 500);
    }

    // 8. Enviar una notificación push
    const isSendNotification = await commonServices.sendNotificationToDevice({
      tokenDevice: userUpdated?.device ? userUpdated.device?.token : "",
      title: "Document Verification",
      description: "Your document has been saved and is under review.",
    });

    // 9. Agregar un descuento por la primera actualización del documento
    const { message, haveNewDiscount, newDiscount } =
      await discountsServices.generateDiscount({
        user: userUpdated,
        type: "saveDocumentChange",
        amount: 0.15,
        status: false,
      });

    // 10. Devolver la respuesta
    return {
      message: ["Document saved successfully", message],
      info: {
        isSendNotification,
        haveNewDiscount: newDiscount ? haveNewDiscount : false,
        user: userUpdated,
      },
    };
  } catch (error) {
    throw error;
  }
};