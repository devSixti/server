import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";

/**
 * catchAsync
 * Wrapper para capturar errores en controladores async
 * y pasarlos al middleware global de manejo de errores.
 */
const catchAsync =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export class UserController {
  /**
   * URL: GET /admin/users
   * Método GET ALL
   * Obtiene todos los usuarios registrados en el sistema.
   */
  static getAll = catchAsync(async (req: Request, res: Response) => {
    const users = await UserService.getAll(req.query);
    res.json({ status: "success", data: users });
  });

  /**
   * URL: GET /admin/users/search
   * Método GET Search
   * Busca usuarios según parámetros de búsqueda.
   */
  static search = catchAsync(async (req: Request, res: Response) => {
    const users = await UserService.search(req.query);
    res.json({ status: "success", data: users });
  });

  /**
   * URL: DELETE /admin/users/:userId
   * Método DELETE
   * Elimina un usuario por ID.
   */
  static delete = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;
    await UserService.deleteUser(userId);
    res.json({
      status: "success",
      message: "Usuario eliminado exitosamente",
    });
  });
}
