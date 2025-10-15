import { emailStyles } from "../styles/styles.email";

export const rejectedEmailBody = (message: string, missingFields?: string[]) => `
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
        <h2>Solicitud Rechazada</h2>
        <p>
          Hola,<br/><br/>
          ${message}
        </p>
        ${
          missingFields && missingFields.length > 0
            ? `
              <div style="margin-top:15px;">
                <p>Motivos del rechazo:</p>
                <ul style="padding-left:20px; color:#d9534f;">
                  ${missingFields.map(field => `<li>${field}</li>`).join("")}
                </ul>
              </div>
            `
            : ""
        }
        <a class="button" href="https://example.com/update">
          Actualizar información
        </a>
        <p style="margin-top:20px; font-size:13px; color:#555;">
          Si no realizaste esta solicitud, por favor contacta a nuestro equipo de soporte inmediatamente.
        </p>
      </div>
      <div class="footer">
        XISTI – Plataforma Digital © ${new Date().getFullYear()} Todos los derechos reservados.
      </div>
    </div>
  </body>
</html>
`;

