import { envValues, firebaseAdmin } from "../config";

interface SendNotificationOptions {
  tokenDevice: string | undefined;
  title: string;
  description: string;
  data?: any;
}

/**
 * Envía una notificación push a un dispositivo específico usando Firebase Cloud Messaging (FCM).
 */

export const sendNotificationToDevice = async ({
  tokenDevice,
  title,
  description,
  data = {},
}: SendNotificationOptions): Promise<boolean> => {
  try {
    const { google_api_send_messages: googleUrl, google_api_key: googleKey } =
      envValues;

    if (!tokenDevice) {
      console.error(`Error al enviar notificación: no se recibió token del dispositivo`);
      return false;
    }

    if (!googleUrl || !googleKey) {
      console.error(`Error al enviar notificación: No env.`);
      return false;
    }

    const message = {
      token: tokenDevice,
      notification: {
        title: title,
        body: description,
      },
      data: data,
      // android: {
      //   priority: "high",
      // },
      // apns: {
      //   payload: {
      //     aps: {
      //       contentAvailable: true,
      //       alert: {
      //         title: title,
      //         body: description,
      //       },
      //     },
      //   },
      // },
    };
    

    const response = await firebaseAdmin.messaging().send(message);

    console.log("Notificación enviada con éxito:", response);

    return true;
  } catch (error) {
    console.error(`Error al enviar notificación: ${error}`);
    return false;
  }
};
