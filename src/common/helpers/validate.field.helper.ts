import { ErrorMsg } from "../utils";

export const validateField: (field: unknown, errorMessage: string) => asserts field =
  (field, errorMessage) => {
    if (!field) {
      throw new Error(errorMessage);
    }
};