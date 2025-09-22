import { emailStyles } from "../../../common/email";

interface VerifyEmailBodyParams {
    token: string;
    email: string;
}

export const verifyEmailBody = ({ token, email }: VerifyEmailBodyParams): string => {
    return `
    <html>
      <head>
        <style>
          ${emailStyles}
        </style>
      </head>
      <body>
        <h2>Su correo electrónico ha sido actualizado</h2>
        <p>
          Hola,<br/><br/>
          Esta es una confirmación de que su correo electrónico ha sido actualizado exitosamente a <strong>${email}</strong>.
        </p>
        <p>
          Si realizó este cambio, por favor confirme haciendo clic en el botón de abajo:
        </p>
        <a href="http://localhost:1010/api/access/verify-email/?&token=${token}">
          <button>Confirmar actualización de correo electrónico</button>
        </a>
        <p class="footer-text">
          Si no realizó este cambio, por favor contacte a nuestro equipo de soporte inmediatamente.
        </p>
      </body>
    </html>
  `;
};