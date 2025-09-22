import { Schema, model } from "mongoose";
import { Vehicle, FuelType } from "../../users/types";
import { ServiceType, Status, VehicleType } from "../../common/types";

const vehicleSchema = new Schema<Vehicle>(
  {
    driver_id: {
      type: Schema.Types.ObjectId,
      ref: "Drivers",
      required: false,
    },
    type: {
      type: String,
      required: true,
      enum: Object.values(VehicleType),
    },

    services: {
      type: [String],
      default: [ServiceType.standard],
      required: false,
      trim: true,
    },

    plates: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      trim: true,
      match: [/^[A-Za-z0-9]{1,7}$/, "El número de placa no es válido"],
    },
    property_card: {
      front_picture: {
        type: String,
        required: false,
        trim: true,
      },
      back_picture: {
        type: String,
        required: false,
        trim: true,
      },
      verified: {
        type: Boolean,
        required: false,
        default: false,
      },
    },
    mandatory_insurance: {
      picture: {
        type: String,
        required: false,
      },
      expiration_date: {
        type: Date,
        required: false,
      },
      verified: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
    technical_mechanical: {
      picture: {
        type: String,
        required: false,
      },
      expiration_date: {
        type: Date,
        required: false,
      },
      verified: {
        type: Boolean,
        required: false,
        default: false,
      },
    },

    pictures: {
      front_picture: {
        type: String,
        required: false,
        trim: true,
      },
      back_picture: {
        type: String,
        required: false,
        trim: true,
      },
      inside_picture: {
        type: String,
        required: false,
        trim: true,
      },
    },
    brand: {
      type: String,
      required: false,
      trim: false,
    },
    model: {
      type: String,
      required: false,
      trim: false,
      min: 1886,
      max: new Date().getFullYear(),
    },
    year: {
      type: Number,
      required: false,
      trim: true,
    },
    color: {
      type: String,
      required: false,
      trim: true,
    },
    capacity: {
      type: Number,
      required: false,
      min: 0,
    },
    fuel_type: {
      type: String,
      required: false,
      enum: Object.values(FuelType),
      default: "gasoline",
    },
    status_request: {
      type: String,
      enum: Object.values(Status),
      default: Status.NOT_REQUESTED,
    },
  },
  { timestamps: true }
);

vehicleSchema.virtual("driver", {
  ref: "Drivers",
  localField: "driver_id",
  foreignField: "_id",
  justOne: true,
});

vehicleSchema.set("toObject", { virtuals: true });
vehicleSchema.set("toJSON", { virtuals: true });

export const VehicleModel = model("Vehicles", vehicleSchema);
