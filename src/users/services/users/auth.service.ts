import { ErrorMsg, capitalizeFirstLetter } from "../../../common/utils";
import { Role } from "../../types";
import { RoleModel, UserModel } from "../../models";
import { generateNickname, generateUserToken } from "../../utils";
import { verifyToken, generateTokens } from "../../../common/utils/generate.jwt.utils";
import { addToBlacklist } from "../../../common/token/tokenBlacklist";

export const AuthService = {
  /**
   * Login o creación de usuario
   */
  authOrCreateUser: async (data: {
    name?: string;
    lastName?: string;
    phone?: { number: string; countryCode?: string };
    email?: string;
    currentLocation?: { latitude: number; longitude: number };
  }) => {
    const { name = "", lastName = "", phone, email, currentLocation } = data;

    if (!email && !phone?.number) {
      throw new ErrorMsg("Email o teléfono requerido para autenticación", 400);
    }

    const latitude = currentLocation?.latitude || 0;
    const longitude = currentLocation?.longitude || 0;

    const searchCriteria: any[] = [];
    if (phone?.number) searchCriteria.push({ "phone.number": phone.number });
    if (email) searchCriteria.push({ "email.address": email });

    let user = await UserModel.findOne({ $or: searchCriteria })
      .populate("role")
      .populate("device")
      .populate("driver");

    // Crear usuario si no existe
    if (!user) {
      const role = await RoleModel.findOne({ name: Role.PASSENGER });

      const newUser = await UserModel.create({
        first_name: name,
        last_name: lastName,
        nick_name: generateNickname(name, lastName),
        phone: phone?.number ? phone : undefined,
        email: {
          address: email || undefined,
          verified: false,
        },
        role_id: role?._id,
        current_location: {
          type: "Point",
          coordinates: [latitude, longitude],
        },
        is_active: true,
      });

      // Generar tokens y guardar refresh token en BD
      const tokens = generateTokens({ id: newUser._id });
      await UserModel.findByIdAndUpdate(newUser._id, {
        refresh_token: tokens.refreshToken,
      });

      return {
        message: `Welcome ${capitalizeFirstLetter(
          `${newUser.first_name} ${newUser.last_name}`
        )}! Your account has been successfully created.`,
        info: { token: tokens, user: { ...newUser.toObject(), role_name: role?.name } },
      };
    }

    // Usuario existente → generar token y actualizar ubicación + refresh_token en BD
    const tokens = generateTokens({ id: user._id });
    await UserModel.findByIdAndUpdate(user._id, {
      current_location: {
        type: "Point",
        coordinates: [latitude, longitude],
      },
      refresh_token: tokens.refreshToken,
    });

    const userObj = user.toObject();
    userObj.role_name = user.role?.name;

    return {
      message: `Welcome, ${capitalizeFirstLetter(
        `${userObj.first_name} ${userObj.last_name}`
      )}! You are now logged in.`,
      info: { token: tokens, user: userObj },
    };
  },

  /**
   * Renovar tokens (access + refresh) usando refresh token
   */
  refreshTokens: async (refreshToken: string) => {
    if (!refreshToken) throw new ErrorMsg("Refresh token requerido", 400);
    const payloadR = verifyToken(refreshToken, "refresh");
    const { id: userId, jti: oldRefreshJti, exp } = payloadR;
    if (!userId || !oldRefreshJti) throw new ErrorMsg("Token inválido", 401);
    const user = await UserModel.findById(userId);
    if (!user) throw new ErrorMsg("Usuario no encontrado", 404);
    if (user.refresh_token !== refreshToken) {
      throw new ErrorMsg("Refresh token inválido", 401);
    }
    // Calcular TTL restante en segundos para el refresh token viejo
    const now = Math.floor(Date.now() / 1000);
    const ttl = exp ? exp - now : 0;
    // Revocar refresh token viejo agregándolo a blacklist
    if (ttl > 0) {
      await addToBlacklist(oldRefreshJti, ttl);
    }
    // Generar nuevos tokens
    const { accessToken, refreshToken: newRefreshToken, accessJti, refreshJti } =
      generateTokens({ id: userId });
    // Guardar nuevo refresh token en BD
    await UserModel.findByIdAndUpdate(userId, {
      refresh_token: newRefreshToken,
    });

    return { accessToken, refreshToken: newRefreshToken, accessJti, refreshJti };
  },

  /**
   * Logout → elimina token de sesión (borrando refresh token)
   */
  logout: async (refreshToken: string, accessToken?: string) => {
    if (!refreshToken) throw new ErrorMsg("Refresh token requerido para logout", 400);
    const payloadR = verifyToken(refreshToken, "refresh");
    const { id: userId, jti: refreshJti } = payloadR;
    if (!userId || !refreshJti) throw new ErrorMsg("Token inválido", 401);
    const user = await UserModel.findById(userId);
    if (!user) throw new ErrorMsg("Usuario no encontrado", 404);
    if (user.refresh_token !== refreshToken) {
      throw new ErrorMsg("Refresh token inválido", 401);
    }
    user.refresh_token = undefined;
    await user.save();
    console.log("✅ [logout] Refresh token eliminado para usuario:", userId);
    if (accessToken) {
      const payloadA = verifyToken(accessToken, "access");
      console.log("[LOGOUT] Payload access token:", payloadA);
      if (payloadA.jti) {
        const now = Math.floor(Date.now() / 1000);
        const exp = (payloadA as any).exp;
        const timeLeft = exp ? exp - now : 0;
        console.log("[LOGOUT] JTI a revocar:", payloadA.jti, "TTL:", timeLeft);
        if (timeLeft > 0) {
          await addToBlacklist(payloadA.jti, timeLeft);
          console.log("🛑 [logout] Access token revocado y agregado a blacklist.");
        } else {
          console.warn("⚠️ [logout] TTL inválido, no se guarda en blacklist.");
        }
      } else {
        console.warn("⚠️ [logout] Access token no tiene jti.");
      }
    }
    return { message: "Logout exitoso" };
  },

  /** Verificación de teléfono (stub)
   */
  verifyPhone: async (phone: string) => {
    if (!phone) throw new ErrorMsg("Número de teléfono requerido", 400);
    return { message: "Teléfono verificado (stub)", phone };
  },
};