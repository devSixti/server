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
        <h2>Your Email Has Been Updated</h2>
        <p>
          Hi there,<br/><br/>
          This is a confirmation that your email has been successfully updated to <strong>${email}</strong>.
        </p>
        <p>
          If you made this change, please confirm by clicking the button below:
        </p>
        <a href="http://localhost:1010/api/access/discount/?email=${email}&token=${token}">
          <button>Confirm Email Update</button>
        </a>
        <p class="footer-text">
          If you did not make this change, please contact our support team immediately.
        </p>
      </body>
    </html>
  `;
};
