import { Role } from "../../users/types";
import { ExpressController } from "../../common/types";
import { ErrorMsg } from "../../common/utils";
import { RoleModel, UserModel } from "../../users/models";


export const checkAdmin: ExpressController = async (req, res, next) => {
    try {
        const id = req.uid

        if (!id) {
            throw new ErrorMsg(
                "Your token is invalid. We couldn’t find your user ID.",
                401
            );
        }
        const admin = await RoleModel.findOne({ name: Role.ADMIN });

        if (!admin) {
            throw new ErrorMsg("Admin role not found", 404);
        }

        if (admin.is_active === false) {
            throw new ErrorMsg("Admin role is inactive", 403);
        }

        const user = await UserModel.findById(id).populate("driver");

        if (user?.role_id?.toString() !== admin?._id?.toString()) {
            throw new ErrorMsg("You are not an admin", 403);
        }

        next()
    } catch (error) {
        next(error);
    }
};