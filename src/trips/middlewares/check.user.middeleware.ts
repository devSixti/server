import { ExpressController, Status } from "../../common/types"; 
import { ErrorMsg } from "../../common/utils"; 
import { UserModel } from "../../users/models"; 

// Middleware que valida que el usuario tenga la información mínima completa en su perfil.
export const checkUser: ExpressController = async (req, res, next) => {
    try {
        // Obtiene el user_id que debió ser inyectado previamente en el request 
        const user_id = req.uid;
        // Busca al usuario en la base de datos usando su ID.
        const user = await UserModel.findById(user_id);
        // Valida si hay campos obligatorios vacíos: nombre, apellido, email o teléfono. Si alguno está vacío (""), se lanza un error indicando que el perfil está incompleto.
        if (
            user?.first_name === "" || 
            user?.last_name === "" || 
            user?.email?.address === "" || 
            user?.phone?.number === ""
        ) {
            throw new ErrorMsg(
                "La información del usuario está incompleta. Por favor complete su perfil.", 
                403
            );
        }
        // Valida específicamente el email, en caso de que sea null o undefined.
        if (user?.email?.address === null || user?.email?.address === undefined) {
            throw new ErrorMsg("Email is required.", 400);
        }
        next();

    } catch (error) {
        next(error);
    }
};