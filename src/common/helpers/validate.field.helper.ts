import { ErrorMsg } from "../utils";

export const validateField = (field: any, errorMessage: string) => {
    if (field === null || field === "" || field === undefined) {
        throw new ErrorMsg(errorMessage, 400);
    }
}