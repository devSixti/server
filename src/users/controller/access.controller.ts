import { ExpressController, QueriesParametes } from "../../common/types";
import { AuthService } from "../services/users/auth.service";
import { UserProfileService } from "../services/users/user.profile.service";
import { UserService } from "../services/users/user.service";
import { UserEmailService } from "../services/users/user.email.service";

// ----------------------
// Auth Controllers
// ----------------------
export const authOrCreateNewUserFirstTime: ExpressController = async (req, res, next) => {
  try {
    const response = await AuthService.authOrCreateUser(req.body);
    res.setHeader("x-token", response.info.token);
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const verifyEmail: ExpressController = async (req, res, next) => {
  try {
    const token = req.query.token as string;
    const response = await UserEmailService.verifyEmail(token);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const verifyPhone: ExpressController = async (req, res, next) => {
  try {
    const phone = req.body.phone as string; // pasar el número de teléfono
    const response = await AuthService.verifyPhone(phone);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateEmail: ExpressController = async (req, res, next) => {
  try {
    const response = await UserEmailService.updateEmail({
      userId: req.uid as string,
      email: req.body.email,
      emailConfirmation: req.body.emailConfirmation,
    });
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const logOut: ExpressController = async (req, res, next) => {
  try {
    const token = req.headers["x-token"] as string;
    delete req.headers["x-token"];
    const response = await AuthService.logout(token);
    res.status(204).json(response);
  } catch (error) {
    next(error);
  }
};

// ----------------------
// User Profile Controllers
// ----------------------
export const updateDevice: ExpressController = async (req, res, next) => {
  try {
    const response = await UserProfileService.updateDevice(req.uid as string, req.body.token);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const updatePersonalUserInfoAuth: ExpressController = async (req, res, next) => {
  try {
    const response = await UserProfileService.updatePersonalInfo(req.uid as string, req.body);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const saveDocument: ExpressController = async (req, res, next) => {
  try {
    const response = await UserProfileService.saveDocument(req.uid as string, req.body);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// ----------------------
// User Controllers
// ----------------------
export const getUserAuth: ExpressController = async (req, res, next) => {
  try {
    const { isDriver = "false" } = req.query as QueriesParametes;
    const response = await UserService.getUserProfile(req.uid as string, isDriver);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const deleteAccount: ExpressController = async (req, res, next) => {
  try {
    const response = await UserService.deleteAccount(req.uid as string);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};