import * as joi from "joi";

interface Envs {
  wompi_api_public_key: string;
  wompi_api_private_key: string;
  wompi_api_integrity_key: string;
  wompi_api_eventes_key: string;
  wompi_api_url: string;

  mailer_service: string;
  mailer_email: string;
  mailer_secret_key: string;

  google_api_send_messages: string;
  google_api_key: string;
  
  port: number;
  jwt_secret: string;
  dbUrl: string;
  node_env: string;
}
const envsSchema = joi
  .object({
    WOMPI_API_PUBLIC_KEY: joi.string().required(),
    WOMPI_API_PRIVATE_KEY: joi.string().required(),
    WOMPI_API_INTEGRITY_KEY: joi.string().required(),
    WOMPI_API_EVENTS_KEY: joi.string().required(),
    WOMPI_API_URL: joi.string().required(),

    MAILER_SERVICE: joi.string().required(),
    MAILER_EMAIL: joi.string().required(),
    MAILER_SECRET_KEY: joi.string().required(),

    GOOGLE_API_SEND_MESSAGES: joi.string().optional().empty(),
    GOOGLE_API_KEY: joi.string().optional().empty(),
    PORT: joi.number().integer().max(9999).required().default(3001),
    JWT_KEY: joi.string().required(),
    DB_URL: joi.string().required(),
    NODE_ENV: joi.string().optional(),
  })
  .unknown(true);
const { error, value } = envsSchema.validate(process.env);

if (error) {
  console.error(`Config validation error: ${error.message}`);
  throw new Error(`Config validation error`);
}

export const envValues: Envs = {
  dbUrl: process.env.DB_URL ?? "",
  wompi_api_public_key: value.WOMPI_API_PUBLIC_KEY,
  wompi_api_private_key: value.WOMPI_API_PRIVATE_KEY,
  wompi_api_integrity_key: value.WOMPI_API_INTEGRITY_KEY,
  wompi_api_eventes_key: value.WOMPI_API_EVENTS_KEY,
  wompi_api_url: value.WOMPI_API_URL,

  mailer_service: value.MAILER_SERVICE,
  mailer_email: value.MAILER_EMAIL,
  mailer_secret_key: value.MAILER_SECRET_KEY,

  google_api_send_messages: value.GOOGLE_API_SEND_MESSAGES,
  google_api_key: value.GOOGLE_API_KEY,

  port: value.PORT ?? 3000,
  jwt_secret: value.JWT_KEY,
  node_env: value.NODE_ENV ?? "NINO",
};
console.log(`Env ${envValues.node_env} ok.`);
