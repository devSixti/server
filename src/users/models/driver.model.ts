import { Schema, model } from "mongoose";
import { Driver } from "../../users/types";
import { Status } from "../../common/types";

const driverSchema = new Schema<Driver>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
    },

    vehicle_id: {
      type: Schema.Types.ObjectId,
      ref: "Vehicles",
      required: false,
    },

    license: {
      front_picture: {
        type: String,
        required: false,
      },
      back_picture: {
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

    criminal_background: {
      picture: {
        type: String,
        required: false,
      },
      verified: {
        type: Boolean,
        required: false,
        default: false,
      },
    },
    is_available: {
      type: Boolean,
      default: false,
    },

    status_request: {
      type: String,
      enum: Object.values(Status),
      default: Status.NOT_REQUESTED,
    },
  },
  { timestamps: true }
);

driverSchema.virtual("vehicle_selected", {
  ref: "Vehicles",
  localField: "vehicle_id",
  foreignField: "_id",
  justOne: true,
});

driverSchema.virtual("vehicles", {
  ref: "Vehicles",
  localField: "_id",
  foreignField: "driver_id",
});

driverSchema.virtual("user_info", {
  ref: "User",
  localField: "user_id",
  foreignField: "_id",
  justOne: true,
});

driverSchema.virtual("wallet", {
  ref: "Wallets",
  localField: "_id",
  foreignField: "driver_id",
  justOne: true,
});

driverSchema.set("toObject", { virtuals: true });
driverSchema.set("toJSON", { virtuals: true });

export const DriverModel = model<Driver>("Drivers", driverSchema);
