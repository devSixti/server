import { UserModel } from "../../users/models";
import { AsyncCustomResponse } from "../../common/types";
import { paginationResults } from "../../common/utils";
import { PaginationDto, SearchParamsDto } from "../../common/dto";

export class UserService {
  //Delete
  static async deleteUser(userInfo: any): AsyncCustomResponse {
    try {
      return { message: "Usuario eliminado exitosamente.", info: {} };
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      throw error;
    }
  }

  //Get all
  static async getAll(paginationDto: PaginationDto): AsyncCustomResponse {
    try {
      const { pageNumber = 1, pageSize = 10 } = paginationDto;

      const page = Number(pageNumber);
      const limit = Number(pageSize);

      const totalItems = await UserModel.countDocuments();

      const users = await UserModel.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("driver")
        .populate("device");

      return {
        message: "Usuarios obtenidos correctamente.",
        info: {
          pagination: paginationResults({
            currentCount: users.length,
            totalItems,
            currentPage: page,
            pageSize: limit,
          }),
          users,
        },
      };
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  }

  //Get by id
  static async search(searchUsersDto: SearchParamsDto): AsyncCustomResponse {
    try {
      const { searchValue } = searchUsersDto;

      const users = await UserModel.find({
        $or: [
          { first_name: { $regex: searchValue, $options: "i" } },
          { last_name: { $regex: searchValue, $options: "i" } },
          { nick_name: { $regex: searchValue, $options: "i" } },
          { country: { $regex: searchValue, $options: "i" } },
          { city: { $regex: searchValue, $options: "i" } },
          { "document.document_id": { $regex: searchValue, $options: "i" } },
          { "document.type": { $regex: searchValue, $options: "i" } },
          { "email.address": { $regex: searchValue, $options: "i" } },
          { "phone.country_code": { $regex: searchValue, $options: "i" } },
          { "phone.number": { $regex: searchValue, $options: "i" } },
        ],
      });

      return {
        message: "Usuarios buscados correctamente.",
        info: {
          pagination: paginationResults({
            currentCount: users.length,
            totalItems: users.length,
            currentPage: 1,
            pageSize: 1,
          }),
          users,
        },
      };
    } catch (error) {
      console.error("Error al buscar usuarios:", error);
      throw error;
    }
  }
}
