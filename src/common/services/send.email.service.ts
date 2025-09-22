import { emailServices } from "../config";

interface SendEmailOptions {
  to: string;
  subject: string;
  htmlBody: string;
}

export const sendEmail = async (options: SendEmailOptions): Promise<boolean> => {
  try {

    let isEmailSend: boolean = false

    const { to, subject, htmlBody } = options;

    const emailService = emailServices();

    const sendInformation = await emailService.sendMail({
      to: to,
      subject: subject,
      html: htmlBody,
    });

    isEmailSend = sendInformation.response.includes(" 2.0.0 OK ")

    return isEmailSend;
  } catch (error) {
    console.error(`Error to send email ${error}`);
    return false;

  }
};