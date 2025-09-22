import { emailStyles } from "../../common/email";

export const approvedEmailBody = (  ) => {
    return `
    <html>
      <head>
        <style>
          ${emailStyles}
        </style>
      </head>
      <body>
        <h2>Su solicitud para unirse a XISTI ha sido aprobada</h2>
        <p>
          Hola,<br/><br/>
          Nos complace informarle que su solicitud para unirse a XISTI ha sido aprobada. Ahora puede acceder a su cuenta y comenzar a usar nuestros servicios.
        </p>
        
        <a href="https://example.com/login">
          <button>Iniciar sesión</button>
        </a>
        <p class="footer-text">
          Si no realizó esta solicitud, por favor contacte a nuestro equipo de soporte inmediatamente.
        </p>
      </body>
    </html>
  `;
};