import { ErrorMsg } from "../utils";

export const validateField = (field: unknown, errorMessage: string): asserts field => {
  if (field === null || field === undefined || field === "") {
    throw new ErrorMsg(errorMessage, 400);
  }
};