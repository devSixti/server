import { ErrorMsg, capitalizeFirstLetter } from "../../../common/utils";
import { Role } from "../../types";
import { RoleModel, UserModel } from "../../models";
import { generateNickname, generateUserToken } from "../../utils";

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
      .populate("driver")
      .lean();

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

      const token = await generateUserToken(newUser);

      return {
        message: `Welcome ${capitalizeFirstLetter(
          `${newUser.first_name} ${newUser.last_name}`
        )}! Your account has been successfully created.`,
        info: { token, user: { ...newUser.toObject(), role_name: role?.name } },
      };
    }

    // Usuario existente → generar token y actualizar ubicación
    const token = await generateUserToken(user);

    await UserModel.updateOne(
      { _id: user._id },
      {
        current_location: {
          type: "Point",
          coordinates: [latitude, longitude],
        },
      }
    );

    const { role, ...userToResponse } = user as any;
    (userToResponse as any).role_name = role?.name;

    return {
      message: `Welcome, ${capitalizeFirstLetter(
        `${userToResponse.first_name} ${userToResponse.last_name}`
      )}! You are now logged in.`,
      info: { token, user: userToResponse },
    };
  },

  /**
   * Logout → elimina token de sesión (stub)
   */
  logout: async (token: string) => {
    return { deletedToken: token };
  },

  /**
   * Verificación de teléfono (stub)
   */
  verifyPhone: async (phone: string) => {
    if (!phone) throw new ErrorMsg("Número de teléfono requerido", 400);
    return { message: "Teléfono verificado (stub)", phone };
  },
};