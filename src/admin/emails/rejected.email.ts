import { emailStyles } from "../../common/email";

export const rejectedEmailBody = ( message: string ) => {
    return `
    <html>
      <head>
        <style>
          ${emailStyles}
        </style>
      </head>
      <body>
        <p>
          Hola,<br/><br/>
          ${message}
        </p>
        
        <a href="">
          <button>Actualizar información.</button>
        </a>
        <p class="footer-text">
          Si no realizó este cambio, por favor contacte a nuestro equipo de soporte inmediatamente.
        </p>
      </body>
    </html>
  `;
};