import { ExpressController, QueriesParametes } from "../../common/types";
import { accessServices } from "../services";

export const authOrCreateNewUserFirstTime: ExpressController = async (req, res, next) => {
  try {
    const userInfo = req.body;
    const response = await accessServices.authOrCreateNewUserFirstTime(userInfo)
    res.setHeader('x-token', response.info.token);
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateDevice: ExpressController = async (req, res, next) => {
  try {
    const id = req.uid as string;
    const deviceInfo = req.body 
    res.status(200).json(await accessServices.updateDevice(id, deviceInfo));
  } catch (error) {
    next(error);
  }
};

export const verifyEmail: ExpressController = async (req, res, next) => {
  try {
    const token = req.query.token as string;
    res.status(200).json(await accessServices.verifyEmail(token));
  } catch (error) {
    next(error);
  }
};

export const verifyPhone: ExpressController = async (req, res, next) => {
  try {
    res.status(200).json(await accessServices.verifyPhone());
  } catch (error) {
    next(error);
  }
};

export const getUserAuth: ExpressController = async (req, res, next) => {
  try {
    const id = req.uid as string;
    const { isDriver = "false" } = req.query as QueriesParametes
    res.status(200).json(await accessServices.getUserAuth(id, isDriver));
  } catch (error) {
    next(error);
  }
};

export const updatePersonalUserInfoAuth: ExpressController = async (req, res, next) => {
  try {
    const id = req.uid as string;
    const updateUserInfo = req.body
    res.status(200).json(await accessServices.updatePersonalUserInfoAuth(id, updateUserInfo));
  } catch (error) {
    next(error);
  }
};

export const updateEmail: ExpressController = async (req, res, next) => {
  try {
    const id = req.uid as string;
    const updateEmailInfo = req.body
    res.status(200).json(await accessServices.updateEmail(id, updateEmailInfo));
  } catch (error) {
    next(error);
  }
};

export const saveDocument: ExpressController = async (req, res, next) => {
  try {
    const id = req.uid as string;
    const documentInfo = req.body
    res.status(200).json(await accessServices.saveDocument(id, documentInfo));
  } catch (error) {
    next(error);
  }
};

export const logOut: ExpressController = async (req, res, next) => {
  try {
    const token = req.headers["x-token"] as string
    delete req.headers['x-token'];
    res.status(204).json(await accessServices.logOut(token));
  } catch (error) {
    next(error);
  }
};
export const deleteAccount: ExpressController = async (req, res, next) => {
  try {
    const id = req.uid as string;
    res.status(200).json(await accessServices.deleteAccount(id));
  } catch (error) {
    next(error);
  }
};

