import { emailStyles } from "../../email";

interface UpdateEmailBodyParams {
  email: string;
  token: string;
}

type UpdateEmailBody = (params: UpdateEmailBodyParams) => string;

export const updateEmailBody: UpdateEmailBody = ({ email, token }) => {
  return `
    <html>
      <head>
        <style>
          ${emailStyles}
        </style>
      </head>
      <body>
        <h2>Tu correo electrónico ha sido actualizado</h2>
        <p>
          Hola,<br/><br/>
          Te confirmamos que tu correo electrónico ha sido actualizado correctamente a <strong>${email}</strong>.
        </p>
        <p>
          Si realizaste este cambio, por favor confirma haciendo clic en el botón a continuación:
        </p>
        <a href="http://localhost:1010/api/access/discount/?email=${email}&token=${token}">
          <button>Confirmar actualización de correo</button>
        </a>
        <p class="footer-text">
          Si no realizaste este cambio, por favor contacta de inmediato a nuestro equipo de soporte.
        </p>
      </body>
    </html>
  `;
};
