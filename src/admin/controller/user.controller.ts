import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export class UserController {
  static async getAll(req: Request, res: Response) {
    try {
      const users = await UserService.getAll(req.query);
      res.json(users);
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message });
    }
  }

  static async search(req: Request, res: Response) {
    try {
      const users = await UserService.search(req.query);
      res.json(users);
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const deleted = await UserService.deleteUser(req.body);
      res.json(deleted);
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message });
    }
  }
}
