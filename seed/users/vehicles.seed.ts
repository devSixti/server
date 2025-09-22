import { Status, VehicleType } from "../../src/common/types";

export const exampleVehicles = [
  {
    driver_id: null as string | null, // Este campo se actualizará después de crear los conductores
    plates: "ABC123",
    property_card: {
      back_picture: "http://example.com/property_back_photo.jpg",
      front_picture: "http://example.com/property_front_photo.jpg",
      verified: true,
    },
    mandatory_insurance: {
      picture: "http://example.com/mandatory_insurance.jpg",
      expiration_date: new Date("2025-05-15"),
      verified: true,
    },
    technical_mechanical: {
      picture: "http://example.com/optional_risk_insurance.jpg",
      verified: true,
      expiration_date: new Date("2025-05-15")
    },

    details: {
      photo: "http://example.com/vehicle_photo.jpg",
      brand: "Toyota",
      model: "Corolla",
      year: 2022,
      capacity: 4,
      color: "Red",
      fuel_type: "gasoline",
    },
    type: VehicleType.car,
    status_request: Status.ACCEPTED,
  },
  {
    driver_id: null as string | null, // Este campo se actualizará después de crear los conductores
    plates: "XYZ987",
    property_card: {
      back_picture: "http://example.com/property_back_photo2.jpg",
      front_picture: "http://example.com/property_front_photo2.jpg",
      verified: true,
    },
    mandatory_insurance: {
      picture: "http://example.com/mandatory_insurance2.jpg",
      expiration_date: new Date("2025-05-15"),
      verified: true,
    },
    technical_mechanical: {
      picture: "http://example.com/optional_risk_insurance2.jpg",
      expiration_date: new Date("2025-05-15"),
      verified: true,
    },
    details: {
      photo: "http://example.com/vehicle_photo2.jpg",
      brand: "Chevrolet",
      model: "Spark",
      year: 2022,
      capacity: 4,
      color: "Red",
      fuel_type: "gasoline",
    },
    type: VehicleType.car,
    status_request: Status.ACCEPTED,
  },
  {
    driver_id: null as string | null, // Este campo se actualizará después de crear los conductores
    plates: "XYZ981",
    property_card: {
      back_picture: "http://example.com/property_back_photo2.jpg",
      front_picture: "http://example.com/property_front_photo2.jpg",
      verified: true,
    },
    mandatory_insurance: {
      picture: "http://example.com/mandatory_insurance2.jpg",
      expiration_date: new Date("2025-05-15"),
      verified: true,
    },
    technical_mechanical: {
      picture: "http://example.com/optional_risk_insurance2.jpg",
      expiration_date: new Date("2025-05-15"),
      verified: true,
    },
    details: {
      photo: "http://example.com/vehicle_photo2.jpg",
      brand: "Chevrolet",
      model: "Spark",
      year: 2022,
      capacity: 4,
      color: "Red",
      fuel_type: "gasoline",
    },
    type: VehicleType.car,
    status_request: Status.ACCEPTED,
  },
  {
    driver_id: null as string | null, // Este campo se actualizará después de crear los conductores
    plates: "XYZ985",
    property_card: {
      back_picture: "http://example.com/property_back_photo2.jpg",
      front_picture: "http://example.com/property_front_photo2.jpg",
      verified: true,
    },
    mandatory_insurance: {
      picture: "http://example.com/mandatory_insurance2.jpg",
      expiration_date: new Date("2025-05-15"),
      verified: true,
    },
    technical_mechanical: {
      picture: "http://example.com/optional_risk_insurance2.jpg",
      expiration_date: new Date("2025-05-15"),
      verified: true,
    },
    details: {
      photo: "http://example.com/vehicle_photo2.jpg",
      brand: "Chevrolet",
      model: "Spark",
      year: 2022,
      capacity: 4,
      color: "Red",
      fuel_type: "gasoline",
    },
    type: VehicleType.car,
    status_request: Status.ACCEPTED,
  },
  {
    driver_id: null as string | null, // Este campo se actualizará después de crear los conductores
    plates: "XYZ984",
    property_card: {
      back_picture: "http://example.com/property_back_photo2.jpg",
      front_picture: "http://example.com/property_front_photo2.jpg",
      verified: true,
    },
    mandatory_insurance: {
      picture: "http://example.com/mandatory_insurance2.jpg",
      expiration_date: new Date("2025-05-15"),
      verified: true,
    },
    technical_mechanical: {
      picture: "http://example.com/optional_risk_insurance2.jpg",
      expiration_date: new Date("2025-05-15"),
      verified: true,
    },
    details: {
      photo: "http://example.com/vehicle_photo2.jpg",
      brand: "Chevrolet",
      model: "Spark",
      year: 2022,
      capacity: 4,
      color: "Red",
      fuel_type: "gasoline",
    },
    type: VehicleType.car,
    status_request: Status.ACCEPTED,
  },
  {
    driver_id: null as string | null, // Este campo se actualizará después de crear los conductores
    plates: "XYZ983",
    property_card: {
      back_picture: "http://example.com/property_back_photo2.jpg",
      front_picture: "http://example.com/property_front_photo2.jpg",
      verified: true,
    },
    mandatory_insurance: {
      picture: "http://example.com/mandatory_insurance2.jpg",
      expiration_date: new Date("2025-05-15"),
      verified: true,
    },
    technical_mechanical: {
      picture: "http://example.com/optional_risk_insurance2.jpg",
      expiration_date: new Date("2025-05-15"),
      verified: true,
    },
    details: {
      photo: "http://example.com/vehicle_photo2.jpg",
      brand: "Chevrolet",
      model: "Spark",
      year: 2022,
      capacity: 4,
      color: "Red",
      fuel_type: "gasoline",
    },
    type: VehicleType.car,
    status_request: Status.ACCEPTED,
  },
  {
    driver_id: null as string | null, // Este campo se actualizará después de crear los conductores
    plates: "XYZ982",
    property_card: {
      back_picture: "http://example.com/property_back_photo2.jpg",
      front_picture: "http://example.com/property_front_photo2.jpg",
      verified: true,
    },
    mandatory_insurance: {
      picture: "http://example.com/mandatory_insurance2.jpg",
      expiration_date: new Date("2025-05-15"),
      verified: true,
    },
    technical_mechanical: {
      picture: "http://example.com/optional_risk_insurance2.jpg",
      expiration_date: new Date("2025-05-15"),
      verified: true,
    },
    details: {
      photo: "http://example.com/vehicle_photo2.jpg",
      brand: "Chevrolet",
      model: "Spark",
      year: 2022,
      capacity: 4,
      color: "Red",
      fuel_type: "gasoline",
    },
    type: VehicleType.car,
    status_request: Status.ACCEPTED,
  },
];
