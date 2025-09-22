import { ExpressController, Status, VehicleType } from "../../common/types";
import { ErrorMsg } from "../../common/utils";
import { VehicleModel } from "../../users/models";

// Define restriction days for cars and motorbikercycles
const restrictionDays: { [key in VehicleType]: { [key: string]: string[] } } = {
    car: {
        Monday: ["0", "2"],
        Tuesday: ["6", "9"],
        Wednesday: ["3", "7"],
        Thursday: ["4", "8"],
        Friday: ["1", "5"]
    },
    motorbike: {
        Monday: ["0", "2"],
        Tuesday: ["6", "9"],
        Wednesday: ["3", "7"],
        Thursday: ["4", "8"],
        Friday: ["1", "5"]
    },
    bike: {}
};

// Middleware to check vehicle restrictions

export const checkVehicle: ExpressController = async (req, res, next) => {
    try {
        // 1. Get vehicle ID from request

        const vehicleId = req.vehicle_uid;

        // 2. Check if vehicle ID is provided

        if (!vehicleId) {
            throw new ErrorMsg("Your vehicle is not registered yet", 403);
        }

        // 3. Find vehicle by ID

        const vehicle = await VehicleModel.findById(vehicleId);

        // 4. Check if vehicle exists

        if (!vehicle) {
            throw new ErrorMsg("Vehicle not found. Please check the information and try again.", 404);
        }

        // 5. Check if vehicle is accepted

        if (vehicle.status_request !== Status.ACCEPTED) {
            throw new ErrorMsg("Vehicle not accepted yet. Please wait for the approval.", 403);
        }

        // 6. Check if vehicle has plates

        if (!vehicle.plates) {
            throw new ErrorMsg("Vehicle must have plates", 403);
        }

        // 7. Get current date and time

        const currentDate = new Date();
        const currentDay = currentDate.toLocaleString('en-US', { weekday: 'long' }) as keyof typeof restrictionDays.car;
        const currentHour = currentDate.getHours();
        const plateRestriction = restrictionDays[vehicle.type][currentDay];

        // 8. Check vehicle type and apply restrictions

        switch (vehicle.type) {
            case VehicleType.car:

                // 8.1 Get the last digit of the vehicle's plate

                const lastPlateNumber = vehicle.plates.charAt(vehicle.plates.length - 1);

                // 8.2 Check if the vehicle is restricted based on the last digit of the plate and current time

                if (plateRestriction.includes(lastPlateNumber) && (currentHour >= 5 && currentHour <= 20)) {
                    throw new ErrorMsg("This vehicle is not allowed to circulate today", 403);
                }
                break;

            case VehicleType.motorbike:

                // 8.3 Get the first digit of the vehicle's plate

                const firstNumber = vehicle.plates.charAt(4);

                // 8.4 Check if the vehicle is restricted based on the first digit of the plate and current time

                if (plateRestriction.includes(firstNumber) && (currentHour >= 5 && currentHour <= 20)) {
                    throw new ErrorMsg("This vehicle is not allowed to circulate today", 403);
                }
                break;
        }

        // 9. Proceed to the next middleware

        next();

    } catch (error) {

        // 10. Pass error to the next middleware

        next(error);
    }
};




