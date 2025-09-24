import { VehicleRepository } from "./../repository/vehicle.repository";
import { PaginationDto } from "../../common/dto"; 
import { AsyncCustomResponse, Status } from "../../common/types";
import { ErrorMsg, paginationResults } from "../../common/utils"; 
import { validateField } from "../../common/helpers";
import { VehicleDoc } from "./../repository/vehicle.repository";

 /** Helper para validar campos obligatorios antes de aprobar un vehículo */
function validateVehicleForApproval(vehicle: VehicleDoc) {
  // Validaciones para asegurar que todos los campos obligatorios están presentes.
  const frontPicture: unknown = vehicle.property_card.front_picture;
  validateField(frontPicture, "La foto frontal de la tarjeta de propiedad es obligatoria.")
  const backPicture: unknown = vehicle.property_card.back_picture;
  validateField(backPicture, "La foto trasera de la tarjeta de propiedad es obligatoria.");
  const insurancePicture: unknown = vehicle.mandatory_insurance.picture;
  validateField(insurancePicture, "La foto del seguro obligatorio es obligatoria.");
  const insuranceExpiration: unknown = vehicle.mandatory_insurance.expiration_date;
  validateField(insuranceExpiration, "La fecha de vencimiento del seguro obligatorio es obligatoria.");
  const technicalPicture: unknown = vehicle.technical_mechanical.picture;
  validateField(technicalPicture, "La foto del certificado técnico-mecánico es obligatoria.");
}

export class VehicleService {
  // Constructor donde se inyecta el repositorio de vehículos
  constructor(private repository = new VehicleRepository()) { }

  /** Aprobar vehículo por ID */
  async approve(vehicleId: string): Promise<AsyncCustomResponse> {
    if (!vehicleId) throw new ErrorMsg("El ID del vehículo es obligatorio.", 400);
    // Busca el vehículo por su ID
    const vehicle = await this.repository.findById(vehicleId);
    if (!vehicle) throw new ErrorMsg("Vehículo no encontrado.", 404); // Si no lo encuentra, lanza un error
    // Verifica si el vehículo ya fue aprobado
    if (vehicle.status_request === Status.ACCEPTED) throw new ErrorMsg("El vehículo ya fue aprobado previamente.", 400)
    // Valida los campos obligatorios del vehículo
    validateVehicleForApproval(vehicle);

    // Actualiza el estado y marca las propiedades como verificadas
    vehicle.status_request = Status.ACCEPTED;
    vehicle.property_card.verified = true;
    vehicle.mandatory_insurance.verified = true;
    vehicle.technical_mechanical.verified = true;

    // Guarda los cambios del vehículo
    await this.repository.save(vehicle);
    return {
      message: "Vehículo aprobado exitosamente.",
      info: { vehicle },
    };
  }

  /** Obtener todos los vehículos con paginación */
  async getAll(paginationDto: PaginationDto): Promise<AsyncCustomResponse> {
    const { pageNumber = 1, pageSize = 10 } = paginationDto; // Extrae los parámetros de paginación, con valores por defecto.
    const page = Number(pageNumber);
    const limit = Number(pageSize);

    // Verifica que los valores de la paginación sean válidos
    if (page <= 0 || limit <= 0) throw new ErrorMsg("Paginación inválida", 400);

    // Obtiene el total de vehículos y los vehículos de la página actual
    const [totalItems, vehicles] = await Promise.all([
      this.repository.countAll(), // Cuenta el total de vehículos
      this.repository.findAll(page, limit), // Obtiene los vehículos con los parámetros de paginación
    ]);

    // Retorna los vehículos con los datos de paginación
    return {
      message: "Vehículos obtenidos correctamente.",
      info: {
        pagination: paginationResults({
          currentCount: vehicles.length,
          totalItems,
          currentPage: page,
          pageSize: limit,
        }),
        vehicles,
      },
    };
  }

  /** Obtener vehículos por driverId con paginación */
  async getByDriverId(driverId: string, paginationDto: PaginationDto): Promise<AsyncCustomResponse> {
    if (!driverId) throw new ErrorMsg("El ID del conductor es obligatorio.", 400);

    const { pageNumber = 1, pageSize = 10 } = paginationDto; // Extrae los parámetros de paginación
    const page = Number(pageNumber);
    const limit = Number(pageSize);

    // Obtiene el total de vehículos y los vehículos asociados a un conductor específico
    const [totalItems, vehicles] = await Promise.all([
      this.repository.countByDriverId(driverId), // Cuenta los vehículos del conductor
      this.repository.findByDriverId(driverId, page, limit), // Obtiene los vehículos del conductor con paginación
    ]);

    // Retorna los vehículos con los datos de paginación
    return {
      message: "Vehículos obtenidos correctamente.",
      info: {
        pagination: paginationResults({
          currentCount: vehicles.length,
          totalItems,
          currentPage: page,
          pageSize: limit,
        }),
        vehicles,
      },
    };
  }
}