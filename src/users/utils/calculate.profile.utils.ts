import { User } from "../types";

export const calculateProfile = (user: User) => {
  const fields: (
    | keyof User
    | "document.id_code"
    | "phone_number.number"
    | "emergency_contact.number"
  )[] = [
    "first_name",
    "last_name",
    "nick_name",
    "picture",
    "birth_date",
    "country",
    "city",
    "email",
    "document.id_code",
    "phone_number.number",
    "emergency_contact.number",
  ];

  let count = 0;

  fields.forEach((field): void => {
    const value = field.includes(".")
      ? field.split(".").reduce((obj, key) => obj?.[key], user as any)
      : user[field as keyof User];

    if (value) {
      count++;
    }
  });

  // Calcula el porcentaje completado
  const completionPercentage = (count / fields.length) * 100;

  return completionPercentage;
};
