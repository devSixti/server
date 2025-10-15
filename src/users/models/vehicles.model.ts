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
      front_picture: String,
      back_picture: String,
      verified: { type: Boolean, default: false },
    },
    mandatory_insurance: {
      picture: String,
      expiration_date: Date,
      verified: { type: Boolean, default: false },
    },
    technical_mechanical: {
      picture: String,
      expiration_date: Date,
      verified: { type: Boolean, default: false },
    },
    pictures: {
      front_picture: String,
      back_picture: String,
      inside_picture: String,
    },
    brand: String,
    model: String,
    year: Number,
    color: String,
    capacity: Number,
    fuel_type: {
      type: String,
      enum: Object.values(FuelType),
      default: "gasoline",
    },
    status_request: {
      type: String,
      enum: Object.values(Status),
      default: Status.NOT_REQUESTED,
    },

    // 🔹 Mantiene trazabilidad de solicitud de eliminación
    delete_request: {
      requested: { type: Boolean, default: false },
      reason: { type: String, trim: true },
      requested_at: { type: Date },
      reviewed_by: { type: Schema.Types.ObjectId, ref: "Admins" },
      reviewed_at: { type: Date },
      status: {
        type: String,
        enum: ["pending", "approved", "rejected", "cancelled"],
        default: "pending",
      },
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