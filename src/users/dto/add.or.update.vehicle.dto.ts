import { SubmittedDTO } from "./submitted.dto";

interface AddOrUpdateVehicleBodyDTO extends SubmittedDTO {
  
  frontPropertyCard: string;
  backPropertyCard: string;

  pictureMandatoryInsurance: string;
  expirationDateMandatoryInsurance: Date;

  pictureTechnicalMechanical: string;
  expirationDateTechnicalMechanical: Date;

  frontPicture: string,
  backPicture: string,
  insidePicture: string,
  brand: string;
  model: string;
  year: number;
  color: string;
  capacity: number;
  fuelType: string;
  ownerDocument: string;
  plates: string;
  type: string;
}

export interface AddOrUpdateVehicleDTO {
  driverId: string,
  vehicleId?: string,
  newVehicleInfo: AddOrUpdateVehicleBodyDTO,
}