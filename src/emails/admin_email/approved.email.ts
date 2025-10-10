import { emailStyles } from "../styles/styles.email";

export const approvedEmailBody = (name: string) => `
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
        <h2>Bienvenido a XISTI</h2>
        <p>Hola <b>${name}</b>,</p>
        <p>
          Nos alegra informarte que tu solicitud ha sido aprobada. 
          Ahora puedes iniciar sesión y comenzar a disfrutar de nuestros servicios.
        </p>
        <a class="button" href="https://example.com/login">Iniciar sesión</a>
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
