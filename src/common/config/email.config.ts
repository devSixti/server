import nodemailer from "nodemailer";
import { envValues } from "./env.config";

export const emailServices = () => {
    const { mailer_email, mailer_service, mailer_secret_key } = envValues
    const transporter = nodemailer.createTransport({
        service: mailer_service,
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: mailer_email,
            pass: mailer_secret_key,
        },

    });

    return transporter
};