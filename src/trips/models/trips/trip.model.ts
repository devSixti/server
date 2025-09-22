import { model, Schema } from "mongoose";
import { Trip, TripStatus } from "../../types";

const tripSchema = new Schema<Trip>(
  {
    passenger_id: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    driver_id: {
      type: Schema.Types.ObjectId,
      ref: "Drivers",
      required: true,
    },
    vehicle_id: {
      type: Schema.Types.ObjectId,
      ref: "Vehicles",
      required: true,
    },
    trip_request_id: {
      type: Schema.Types.ObjectId,
      ref: "TripsRequest",
      required: true,
    },
    total_fare: {
      type: Number,
      required: true,
    },

    discount_id: {
      type: Schema.Types.ObjectId,
      ref: "Discounts",
    },

    final_fare: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(TripStatus),
    },
    acceptedAt: { 
      type: Date,
    },
  },
  { timestamps: true }
)
  .set("toObject", { virtuals: true })
  .set("toJSON", { virtuals: true });

  tripSchema.virtual("driver", {
    ref: "Drivers",
    localField: "driver_id",
    foreignField: "_id",
    justOne: true,
  });

  tripSchema.virtual("passenger", {
    ref: "Users",
    localField: "passenger_id",
    foreignField: "_id",
  });


export const TripModel = model<Trip>("Trips", tripSchema);
