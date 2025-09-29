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
      .lean(); // Usamos lean() para obtener un objeto plano

    // Hacemos un cast explícito para decirle a TypeScript que esto es un IUser[]
    return users.map(user => ({
      ...user,
      email: user.email ? { address: user.email.address } : undefined,
    })) as unknown as IUser[];  // Forzamos el tipo
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
      .lean(); // Usamos lean() para obtener un objeto plano

    // Hacemos un cast explícito para decirle a TypeScript que esto es un IUser[]
    return users.map(user => ({
      ...user,
      email: user.email ? { address: user.email.address } : undefined,
    })) as unknown as IUser[];  // Forzamos el tipo
  }
}

/**
 * Servicio de usuario que expone operaciones de negocio y delega la persistencia a UserRepository.
 */
export class UserService {
  constructor(private readonly userRepository: IUserRepository = new UserRepository()) {}

  async deleteUser(userId: string): AsyncCustomResponse {
    if (!userId) throw new ErrorMsg("ID de usuario es requerido", 400);

    try {
      const deletedUser = await this.userRepository.deleteById(userId);
      if (!deletedUser) throw new ErrorMsg("Usuario no encontrado", 404);

      return { message: "Usuario eliminado exitosamente.", info: { deletedUser } };
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      throw new ErrorMsg("Error al eliminar usuario", 500);
    }
  }

  async getAll(paginationDto: PaginationDto): AsyncCustomResponse {
    const { pageNumber = 1, pageSize = 10 } = paginationDto;
    const page = Number(pageNumber);
    const limit = Number(pageSize);

    if (page <= 0 || limit <= 0) throw new ErrorMsg("Paginación inválida", 400);

    try {
      const totalItems = await this.userRepository.countAll();
      const users = await this.userRepository.findAll(page, limit);

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
      throw new ErrorMsg("Error al obtener usuarios", 500);
    }
  }

  async search(searchDto: SearchParamsDto & PaginationDto): AsyncCustomResponse {
    const { searchValue, pageNumber = 1, pageSize = 10 } = searchDto;
    const page = Number(pageNumber);
    const limit = Number(pageSize);

    if (!searchValue) throw new ErrorMsg("El valor de búsqueda es requerido", 400);
    if (page <= 0 || limit <= 0) throw new ErrorMsg("Paginación inválida", 400);

    try {
      const users = await this.userRepository.search(searchValue, page, limit);
      const totalItems = users.length;

      return {
        message: "Usuarios buscados correctamente.",
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
      console.error("Error al buscar usuarios:", error);
      throw new ErrorMsg("Error al buscar usuarios", 500);
    }
  }
}