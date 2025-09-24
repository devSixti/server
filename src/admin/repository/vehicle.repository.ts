import { VehicleModel } from "../../users/models";
import { Document } from "mongoose";
import { Vehicle } from "../../users/types/vehicle.type";

export type VehicleDoc = Document & Vehicle;

export class VehicleRepository {
    constructor(private model = VehicleModel) { }

    /** Buscar vehículo por ID y popular relaciones */
    async findById(vehicleId: string): Promise<VehicleDoc | null> {
        return this.model.findById(vehicleId).populate({
            path: "driver",
            populate: { path: "user_info" },
        }) as unknown as VehicleDoc | null; // tipo seguro para TS
    }

    /** Guardar vehículo */
    async save(vehicle: VehicleDoc): Promise<VehicleDoc> {
        return vehicle.save();
    }

    /** Contar todos los vehículos */
    async countAll(): Promise<number> {
        return this.model.countDocuments();
    }

    /** Obtener todos los vehículos con paginación */
    async findAll(page: number, limit: number): Promise<Vehicle[]> {
        return this.model
            .find()
            .skip((page - 1) * limit)
            .limit(limit)
            .populate("driver");
    }

    /** Buscar vehículos por driverId con paginación */
    async findByDriverId(driverId: string, page: number, limit: number): Promise<Vehicle[]> {
        return this.model
            .find({ driver_id: driverId })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate({
                path: "driver",
                populate: { path: "user_info" },
            });
    }

    /** Contar vehículos por driverId */
    async countByDriverId(driverId: string): Promise<number> {
        return this.model.countDocuments({ driver_id: driverId });
    }
}
