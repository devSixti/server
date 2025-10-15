import { emailStyles } from "../styles/styles.email";

interface UpdateEmailBodyParams {
  email: string;
  token: string;
}

type UpdateEmailBody = (params: UpdateEmailBodyParams) => string;

export const updateEmailBody: UpdateEmailBody = ({ email, token }) => {
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
          <h2>¡Tu correo ha sido actualizado y tienes un beneficio especial!</h2>
          <p>
            Hola,<br/><br/>
            Te confirmamos que tu correo electrónico ha sido actualizado correctamente a 
            <strong>${email}</strong>.
          </p>

          <p>
            Como agradecimiento por mantener tu información actualizada, te hemos otorgado un 
            <strong>descuento del 15%</strong> en tu próxima compra o servicio dentro de XISTI 🎉
          </p>

          <p>
            Para activar tu descuento, simplemente haz clic en el siguiente botón:
          </p>

          <a class="button" href="http://localhost:1010/api/access/discount/?email=${email}&token=${token}">
            Activar mi descuento del 15%
          </a>

          <p style="margin-top:20px; font-size:13px; color:#555;">
            Si no realizaste esta actualización o no reconoces este cambio, 
            por favor contacta de inmediato a nuestro equipo de soporte.
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