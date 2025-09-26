import { Role, Vehicle } from "../../users/types"; 
import { Status } from "../../common/types";    
import { RoleModel, VehicleModel } from "../../users/models";

// Interfaz para definir la estructura del resultado con los conductores más cercanos
interface NearestDrivers {
    nearestDrivers: Vehicle[]; 
    maxDistance: number;  
    increment: number;       
}
// Función principal que busca los conductores más cercanos
export const findNearestDrivers = async (
    type: string,         
    origin: { latitude: number, longitude: number }
): Promise<NearestDrivers> => {
    // Validación de parámetros de entrada
    if (!origin || !origin.latitude || !origin.longitude) {
        throw new Error("Invalid origin parameters"); 
    }
    if (!type) {
        throw new Error("Type is required"); 
    }
    try {
        // Encontrar el rol de DRIVER
        const driverRole = await RoleModel.findOne({ name: Role.DRIVER });
        if (!driverRole) {
            throw new Error("Driver role not found"); 
        }
        let nearestDrivers: Vehicle[] = []; 
        let maxDistance = 2000;       
        const maxLimit = 10000;     
        const increment = 1000;       
        // Búsqueda de conductores dentro de rangos crecientes
        while (nearestDrivers.length === 0 && maxDistance <= maxLimit) {
            nearestDrivers = await VehicleModel.find({
                type: type,             
                status_request: Status.ACCEPTED,  
            })
                .populate({
                    path: "driver",          
                    match: { is_available: true, status_request: Status.ACCEPTED }, 
                    populate: {
                        path: "user_info",      
                        match: {
                            is_active: true,       
                            role_id: driverRole?._id, 
                            current_location: {
                                $near: {
                                    $geometry: {
                                        type: "Point",
                                        coordinates: [origin.longitude, origin.latitude], 
                                    },
                                    $maxDistance: maxDistance, 
                                },
                            },
                        },
                        populate: {
                            path: "device",       
                        },
                    },
                });
            // Filtrar vehículos que no tienen información del conductor
            nearestDrivers = nearestDrivers.filter(
                (vehicle) => vehicle.driver?.user_info !== null
            );
            if (nearestDrivers.length === 0) {
                maxDistance += increment; 
            }
        }
        return { nearestDrivers, maxDistance, increment }; 
    } catch (error) {
        console.error("Error finding nearest drivers:", error); 
        throw new Error("Could not find nearest drivers");  
    }
};