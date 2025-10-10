import { emailStyles } from "../styles/styles.email";

interface VerifyEmailBodyParams {
  token: string;
  email: string;
}

export const verifyEmailBody = ({ token, email }: VerifyEmailBodyParams): string => {
  return `
  <html>
    <head>
      <style>${emailStyles}</style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>XISTI</h1>
        </div>
        <div class="content">
          <h2>Confirmación de actualización de correo electrónico</h2>
          <p>
            Hola,<br/><br/>
            Esta es una confirmación de que tu correo electrónico ha sido actualizado exitosamente a 
            <strong>${email}</strong>.
          </p>
          <p>
            Si realizaste este cambio, por favor confirma haciendo clic en el siguiente botón:
          </p>
          <a class="button" href="http://localhost:1010/api/users/email/verify/?&token=${token}">
            Confirmar actualización de correo electrónico
          </a>
          <p style="margin-top:20px; font-size:13px; color:#555;">
            Si no realizaste este cambio, por favor contacta de inmediato a nuestro equipo de soporte.
          </p>
        </div>
        <div class="footer">
          XISTI – Plataforma Digital © ${new Date().getFullYear()} Todos los derechos reservados.
        </div>
      </div>
    </body>
  </html>
  `;
};
