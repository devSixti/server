import { envValues, firebaseAdmin } from "../config";

interface SendNotificationOptions {
  tokenDevice: string | undefined;
  title: string;
  description: string;
  data?: any;
}

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
      console.error(`Error sending message: No token device.`);
      return false;
    }

    if (!googleUrl || !googleKey) {
      console.error(`Error sending message: No env.`);
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

    console.log("Message sent successfully:", response);

    return true;
  } catch (error) {
    console.error(`Error sending notification: ${error}`);
    return false;
  }
};
