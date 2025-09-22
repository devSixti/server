import { Vehicle } from "../../users/types";

export const transformVehicleData = (vehicle?: Vehicle | null) => {

    if (!vehicle) {
        return null;
    }

    const { pictures, property_card, mandatory_insurance, technical_mechanical, ...restVehicle } = vehicle as any;

    restVehicle.frontPicture = pictures?.front_picture || null;
    restVehicle.backPicture = pictures?.back_picture || null;
    restVehicle.insidePicture = pictures?.inside_picture || null;

    restVehicle.frontPropertyCard = property_card?.front_picture || null;
    restVehicle.backPropertyCard = property_card?.back_picture || null;
    restVehicle.verifiedPropertyCard = property_card?.verified || false;

    restVehicle.verifiedMandatoryInsurance = mandatory_insurance?.verified || false;
    restVehicle.pictureMandatoryInsurance = mandatory_insurance?.picture || null;
    restVehicle.expirationDateMandatoryInsurance = mandatory_insurance?.expiration_date || null;

    restVehicle.verifiedTechnicalMechanical = technical_mechanical?.verified || false;
    restVehicle.pictureTechnicalMechanical = technical_mechanical?.picture || null;
    restVehicle.expirationDateTechnicalMechanical = technical_mechanical?.expiration_date || null;

    return restVehicle;
}