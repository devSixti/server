import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/users/auth.service";
import { ReviewService } from "../services/users/calificate.user.service";
import { UserService } from "../services/users/user.service";
import { UserEmailService } from "../services/users/user.email.service";
import { UserProfileService } from "../services/users/user.profile.service";

/**
 * Helper para capturar errores async
 */
const catchAsync =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

/**
 * Controlador centralizado de operaciones de usuarios
 */
export class UserController {
  /**
   * Login o crear usuario
   */
  static authOrCreateUser = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.authOrCreateUser(req.body);
    res.status(200).json({
      status: "success",
      message: result.message,
      data: result.info,
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * Logout
   */
  static logout = catchAsync(async (req: Request, res: Response) => {
    const refreshToken = req.body.refreshToken || req.headers['x-refresh-token'];
    const authHeader = req.headers["authorization"];
    let accessToken = authHeader && authHeader.toString().startsWith("Bearer ")
      ? authHeader.toString().replace("Bearer ", "")
      : undefined;

    if (!accessToken) {
      accessToken = req.headers["x-token"]?.toString();
    }
    const result = await AuthService.logout(refreshToken, accessToken);
    res.status(200).json({
      status: "success",
      message: result.message,
      data: result,
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * Verificación de teléfono
   */
  static verifyPhone = catchAsync(async (req: Request, res: Response) => {
    const { phone } = req.body;
    const result = await AuthService.verifyPhone(phone);
    res.status(200).json({
      status: "success",
      message: result.message,
      data: result,
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * Calificar a un usuario
   */
  static calificateUser = catchAsync(async (req: Request, res: Response) => {
    const { tripId } = req.params;
    const { comment, rating } = req.body;
    const userId = req.uid;
    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "No autorizado: no se encontró el userId en el token.",
        timestamp: new Date().toISOString(),
      });
    }
    const result = await ReviewService.calificateUser(userId, tripId, {
      comment,
      rating,
    });
    res.status(201).json({
      status: "success",
      message: result.message,
      data: result.info,
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * Obtener el perfil de un usuario (y conductor si aplica)
   */
  static getUserProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = req.uid!;
    const driverId = req.driver_uid;
    const result = await UserService.getUserProfile(userId, driverId);
    res.json({ status: "success", data: result });
  });

  /**
   * Renovar tokens (access + refresh) usando refresh token
   */
  static refreshToken = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const tokens = await AuthService.refreshTokens(refreshToken);

    res.status(200).json({
      status: "success",
      message: "Tokens renovados correctamente",
      data: {
        token: tokens,
      },
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * Eliminar la cuenta de un usuario
   */
  static deleteAccount = catchAsync(async (req: Request, res: Response) => {
    const userId = req.uid!;
    const { reason } = req.body;

    const result = await UserService.deleteAccount(userId, reason);
    res.status(201).json({
      status: "success",
      message: result.message,
      data: result.info,
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * Actualizar el email de un usuario
   */
  static updateEmail = catchAsync(async (req: Request, res: Response) => {
    const userId = req.uid!;
    const { email, emailConfirmation } = req.body;
    const result = await UserEmailService.updateEmail({
      userId,
      email,
      emailConfirmation,
    });
    res.json({ status: "exito", data: result });
  });

  /**
   * Verificar email con token
   */
  static verifyEmail = catchAsync(async (req: Request, res: Response) => {
    const token = req.query.token || req.body.token;
    const result = await UserEmailService.verifyEmail(token);
    res.json({ status: "exito", data: result });
  });

  /**
   * Actualizar información personal
   */
  static updatePersonalInfo = catchAsync(async (req: Request, res: Response) => {
    const userId = req.uid!;
    const result = await UserProfileService.updatePersonalInfo(userId, req.body);
    res.json({ status: "success", data: result });
  });

  /**
   * Guardar documento de identificación
   */
  static saveDocument = catchAsync(async (req: Request, res: Response) => {
    const userId = req.uid!;
    const result = await UserProfileService.saveDocument(userId, req.body);
    res.json({ status: "success", data: result });
  });

  /**
   * Actualizar o crear el dispositivo asociado a un usuario
   */
  static updateDevice = catchAsync(async (req: Request, res: Response) => {
    const userId = req.uid!;
    const { token } = req.body;
    const result = await UserProfileService.updateDevice(userId, token);
    res.json({ status: "success", data: result });
  });
}
