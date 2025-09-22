import { AsyncCustomResponse } from "../../../common/types";

export const verifyPhone = async (): AsyncCustomResponse => {
    try {
        return {
            message: "Verify phone successfully.",
            info: {  },
        };
    } catch (error) {
        throw error;
    }
};
