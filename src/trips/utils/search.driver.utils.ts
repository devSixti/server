import { Role, Vehicle } from "../../users/types";
import { Status } from "../../common/types";
import { RoleModel, VehicleModel } from "../../users/models";

interface NearestDrivers {
    nearestDrivers: Vehicle[];
    maxDistance: number;
    increment: number;
}

export const findNearestDrivers = async (type: string, origin: { latitude: number, longitude: number }): Promise<NearestDrivers> => {
    // 2. Find the role of DRIVER
    const driverRole = await RoleModel.findOne({ name: Role.DRIVER });

    let nearestDrivers: any[] = [];
    let maxDistance = 2000; // Initial range (2 km)
    const maxLimit = 10000; // Maximum range (10 km)
    const increment = 1000; // Range increment (1 km)

    // 3. Search for drivers within increasing ranges
    while (nearestDrivers.length === 0 && maxDistance <= maxLimit) {
        nearestDrivers = await VehicleModel.find({
            type: type,
            status_request: Status.ACCEPTED,
        })
            .populate({
                path: "driver",
                match: { is_available: true, status_request: Status.ACCEPTED }, // Filtra conductores disponibles y aceptados
                populate: {
                    path: "user_info",
                    match: {
                        is_active: true,
                        role_id: driverRole?._id,
                        current_location: {
                            $near: {
                                $geometry: {
                                    type: "Point",
                                    coordinates: [origin.longitude, origin.latitude ],
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

        nearestDrivers = nearestDrivers.filter(
            (vehicle) => vehicle.driver?.user_info !== null
        );

        if (nearestDrivers.length === 0) {
            maxDistance += increment;
        }
    }

    return {nearestDrivers, maxDistance, increment};
}