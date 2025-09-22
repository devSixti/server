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

        // 6. Check if vehicle property card is verified
        if (vehicle.property_card.verified === false) {
            throw new ErrorMsg("Vehicle property card not verified yet", 403);
        }

        // 7. Check if vehicle mandatory insurance is verified
        if (vehicle.mandatory_insurance.verified === false) {
            throw new ErrorMsg("Vehicle mandatory insurance not verified yet", 403);
        }

        // 8. Check if vehicle technical mechanical is verified
        if (vehicle.technical_mechanical.verified === false) {
            throw new ErrorMsg("Vehicle technical mechanical not uploaded yet", 403);
        }

        // 9. Check if vehicle mandatory insurance has expired
        if (vehicle.mandatory_insurance.expiration_date < new Date()) {
            vehicle.mandatory_insurance.verified = false;
            vehicle.status_request = Status.PENDING;
            await vehicle.save();
            throw new ErrorMsg("Vehicle mandatory insurance has expired", 403);
        }

        // 10. Check if vehicle technical mechanical has expired
        if (vehicle.technical_mechanical.expiration_date < new Date()) {
            vehicle.technical_mechanical.verified = false;
            vehicle.status_request = Status.PENDING;
            await vehicle.save();
            throw new ErrorMsg("Vehicle technical mechanical has expired", 403);
        }

        // 11. Check if vehicle has plates
        if (!vehicle.plates) {
            throw new ErrorMsg("Vehicle must have plates", 403);
        }

        // 12. Get current date and time
        const currentDate = new Date();
        const currentDay = currentDate.toLocaleString('en-US', { weekday: 'long' }) as keyof typeof restrictionDays.car;
        const currentHour = currentDate.getHours();
        const plateRestriction = restrictionDays[vehicle.type][currentDay];

        // 13. Check vehicle type and apply restrictions
        switch (vehicle.type) {

            case VehicleType.car:
                // 13.1 Get the last digit of the vehicle's plate
                const lastPlateNumber = vehicle.plates.charAt(vehicle.plates.length - 1);

                // 13.2 Check if the vehicle is restricted based on the last digit of the plate and current time
                if (plateRestriction.includes(lastPlateNumber) && (currentHour >= 5 && currentHour <= 20)) {
                    throw new ErrorMsg("This vehicle is not allowed to circulate today", 403);
                }
                break;

            case VehicleType.motorbike:
                // 13.3 Get the first digit of the vehicle's plate
                const firstNumber = vehicle.plates.charAt(4);

                // 13.4 Check if the vehicle is restricted based on the first digit of the plate and current time
                if (plateRestriction.includes(firstNumber) && (currentHour >= 5 && currentHour <= 20)) {
                    throw new ErrorMsg("This vehicle is not allowed to circulate today", 403);
                }
                break;
        }

        // 14. Proceed to the next middleware
        next();

    } catch (error) {
        // 15. Pass error to the next middleware
        next(error);
    }
};




