import { UserModel } from "../../users/models";
import { IUser } from "../../users/types/IUser";
import { AsyncCustomResponse } from "../../common/types";
import { paginationResults } from "../../common/utils";
import { PaginationDto, SearchParamsDto } from "../../common/dto";
import { ErrorMsg } from "../../common/utils";

/**
 * Interface que define las operaciones de persistencia
 */
interface IUserRepository {
  deleteById(userId: string): Promise<IUser | null>;
  findAll(page: number, limit: number): Promise<IUser[]>;
  countAll(): Promise<number>;
  search(query: string, page: number, limit: number): Promise<IUser[]>;
}

/**
 * Implementación concreta del repositorio de usuarios usando Mongoose.
 */
class UserRepository implements IUserRepository {
  async deleteById(userId: string): Promise<IUser | null> {
    return UserModel.findByIdAndDelete(userId);
  }
  /** Devuelve todos los usuarios con paginación y relaciones */
  async findAll(page: number, limit: number): Promise<IUser[]> {
    const users = await UserModel.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("driver")
      .populate("device")
      .lean(); // se usa lean() para obtener un objeto plano
    return users.map((user) => ({
      ...user,
      email: user.email ? { address: user.email.address } : undefined,
    })) as unknown as IUser[]; // Forzamos el tipo
  }

  /** Cuenta todos los documentos de usuarios */
  async countAll(): Promise<number> {
    return UserModel.countDocuments();
  }

  /**
   * Busca usuarios según un query y devuelve resultados paginados
   */
  async search(query: string, page: number, limit: number): Promise<IUser[]> {
    const users = await UserModel.find({
      is_active: true,
      $or: [
        { first_name: { $regex: query, $options: "i" } },
        { last_name: { $regex: query, $options: "i" } },
        { nick_name: { $regex: query, $options: "i" } },
        { country: { $regex: query, $options: "i" } },
        { city: { $regex: query, $options: "i" } },
        { "document.document_id": { $regex: query, $options: "i" } },
        { "document.type": { $regex: query, $options: "i" } },
        { "email.address": { $regex: query, $options: "i" } },
        { "phone.country_code": { $regex: query, $options: "i" } },
        { "phone.number": { $regex: query, $options: "i" } },
      ],
    })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("driver")
      .populate("device")
      .lean();
    return users.map((user) => ({
      ...user,
      email: user.email ? { address: user.email.address } : undefined,
    })) as unknown as IUser[];
  }
}

/**
 * Servicio de usuario que expone operaciones de negocio y delega la persistencia a UserRepository.
 */
export class UserService {
  constructor(
    private readonly userRepository: IUserRepository = new UserRepository()
  ) {}
  /**
   * Desactiva un usuario por su ID, deshabilitando su cuenta y verificaciones asociadas.
   */
  async deactivateUser(userId: string): AsyncCustomResponse {
    if (!userId) throw new ErrorMsg("ID de usuario es requerido", 400);

    try {
      // Buscar el usuario en la base de datos por su ID
      const user = await UserModel.findById(userId);
      if (!user) throw new ErrorMsg("Usuario no encontrado", 404);
      user.is_active = false;
      user.document.verified = false;
      if (user.email) {
        user.email.verified = false;
      }
      if (user.phone) {
        user.phone.verified = false;
      }
      await user.save();
      return {
        status: "success",
        message: "Usuario desactivado exitosamente.",
        info: { user },
      };
    } catch (error) {
      console.error("Error al desactivar usuario:", error);
      throw new ErrorMsg("Error al desactivar usuario", 500);
    }
  }
  /**
   * Obtiene todos los usuarios con paginación.
   */
  async getAll(paginationDto: PaginationDto): AsyncCustomResponse {
    const { pageNumber = 1, pageSize = 10 } = paginationDto;
    const page = Number(pageNumber);
    const limit = Number(pageSize);
    // Validar que página y tamaño sean positivos
    if (page <= 0 || limit <= 0) throw new ErrorMsg("Paginación inválida", 400);

    try {
      // Contar total de usuarios en la base de datos
      const totalItems = await this.userRepository.countAll();
      const users = await this.userRepository.findAll(page, limit);
      // Retornar resultado con usuarios y datos de paginación
      return {
        status: "success",
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
      throw new ErrorMsg("Error al obtener usuarios", 500);
    }
  }
  /**
   * Busca usuarios activos que coincidan con un término de búsqueda, con paginación.
   */
  async search(
    searchDto: SearchParamsDto & PaginationDto
  ): AsyncCustomResponse {
    const { searchValue, pageNumber = 1, pageSize = 10 } = searchDto;
    const page = Number(pageNumber);
    const limit = Number(pageSize);
    // Validar que se proporcione el valor de búsqueda
    if (!searchValue)
      return {
        status: "error",
        message: "El valor de búsqueda es requerido",
        info: null,
      };
    // Validar parámetros de paginación positivos
    if (page <= 0 || limit <= 0)
      return {
        status: "error",
        message: "Paginación inválida",
        info: null,
      };

    try {
      // Buscar usuarios activos que coincidan con el término de búsqueda
      const activeUsers = await this.userRepository.search(
        searchValue,
        page,
        limit
      );
      // Si no hay usuarios activos, buscar usuarios inactivos que coincidan
      if (activeUsers.length === 0) {
        const inactiveUsers = await UserModel.find({
          is_active: false,
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
        }).lean();
        // Si hay usuarios inactivos que coinciden, retorna error informando que existen pero están desactivados
        if (inactiveUsers.length > 0) {
          return {
            status: "error",
            message: "El usuario existe pero está desactivado",
            info: null,
          };
        }
      }
      const totalItems = activeUsers.length;
      return {
        status: "success",
        message: "Usuarios buscados correctamente.",
        info: {
          pagination: paginationResults({
            currentCount: activeUsers.length,
            totalItems,
            currentPage: page,
            pageSize: limit,
          }),
          users: activeUsers,
        },
      };
    } catch (error) {
      console.error("Error al buscar usuarios:", error);
      return {
        status: "error",
        message: "Error al buscar usuarios",
        info: null,
      };
    }
  }
}