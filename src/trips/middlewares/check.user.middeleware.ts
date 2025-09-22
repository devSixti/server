import { ExpressController, Status } from "../../common/types";
import { ErrorMsg } from "../../common/utils";
import { UserModel } from "../../users/models";

export const checkUser: ExpressController = async (req, res, next) => {
    try {
        const user_id = req.uid;

        const user = await UserModel.findById(user_id)



        if (user?.first_name === "" || user?.last_name === "" || user?.email?.address === "" || user?.phone?.number === "") {
            throw new ErrorMsg("La información del usuario está incompleta. Por favor complete su perfil.", 403);
        }

        if (user?.email?.address === null || user?.email?.address === undefined) {
            throw new ErrorMsg("Email is required.", 400);
        }


        next();

    } catch (error) {
        next(error);
    }
};




