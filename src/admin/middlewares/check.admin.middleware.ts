import { Role } from "../../users/types";
import { ExpressController } from "../../common/types";
import { ErrorMsg } from "../../common/utils";
import { RoleModel, UserModel } from "../../users/models";

/**
 * Middleware para verificar si el usuario autenticado tiene el rol de Administrador.
 * @route Middleware
 * @throws 401 Si el token no contiene un ID de usuario válido
 * @throws 404 Si el rol Administrador no existe en la base de datos
 * @throws 403 Si el rol está inactivo o el usuario no tiene permisos de administrador
 */
export const checkAdmin: ExpressController = async (req, res, next) => {
  const id = req.uid;

  if (!id) {
    throw new ErrorMsg(
      "Tu token no es válido. No pudimos encontrar tu ID de usuario.",
      401
    );
  }

  const adminRole = await RoleModel.findOne({ name: Role.ADMIN });

  if (!adminRole) {
    throw new ErrorMsg("No se encontró el rol Administrador.", 404);
  }

  if (!adminRole.is_active) {
    throw new ErrorMsg("El rol Administrador está inactivo.", 403);
  }

  const user = await UserModel.findById(id).populate("driver");

  if (!user?.role_id?.equals(adminRole._id)) {
    console.error("[ADMIN CHECK] Rol NO coincide");
    throw new ErrorMsg("No tienes permisos de administrador.", 403);
  }

  next();
};
