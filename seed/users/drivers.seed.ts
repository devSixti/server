import { Driver } from "../../src/users/types";
import { Status } from "../../src/common/types";

export const exampleDrivers = [
  {
    user_id: null as string | null, // Este campo se actualizará después de crear los usuarios
    license: {
      front_picture: "http://example.com/driver_front_photo.jpg",
      back_picture: "http://example.com/driver_back_photo.jpg",
      expiration_date: new Date("2024-12-01"),
      verified: true,
    },
    criminal_background: {
      picture: "http://example.com/driver_front_photo.jpg",
      verified: true,
    },
    is_available: true,
    status_request: Status.ACCEPTED,
  },

  {
    user_id: null as string | null, // Este campo se actualizará después de crear los usuarios
    license: {
      front_picture: "http://example.com/driver_front_photo.jpg",
      back_picture: "http://example.com/driver_back_photo.jpg",
      expiration_date: new Date("2024-12-01"),
      verified: true,
    },
    criminal_background: {
      picture: "http://example.com/driver_front_photo.jpg",
      verified: true,
    },
    is_available: true,
    status_request: Status.ACCEPTED,
  },
];
