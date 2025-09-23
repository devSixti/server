import { emailServices } from "../config";

interface SendEmailOptions {
  to: string;
  subject: string;
  htmlBody: string;
}

/**
 * Envía un correo electrónico utilizando el servicio configurado.
 */
export const sendEmail = async (options: SendEmailOptions): Promise<boolean> => {
  try {
    let isEmailSend = false;
    const { to, subject, htmlBody } = options;

    const emailService = emailServices();

    const sendInformation = await emailService.sendMail({
      to,
      subject,
      html: htmlBody,
    });

    isEmailSend = sendInformation.response.includes(" 2.0.0 OK ");
    return isEmailSend;
  } catch (error) {
    console.error(`Error al enviar correo: ${error}`);
    return false;
    
  }
};
