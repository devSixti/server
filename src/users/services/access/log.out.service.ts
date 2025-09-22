import { AsyncCustomResponse } from "common/types";

export const logOut = async (token: string): AsyncCustomResponse => {
    try {

        return { message: 'Logout successful', info: { deletedToken: token } }

    } catch (error) {
        throw error;
    }
};
