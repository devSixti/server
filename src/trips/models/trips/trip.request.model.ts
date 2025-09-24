import { model, Schema } from "mongoose";
import { PaymentMethod, RequestStatus, TripRequest } from "../../types";
import { ServiceType } from "../../../common/types";

const tripRequestSchema = new Schema<TripRequest>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    origin: {
      type: {
        type: String, // Debe ser "Point"
        enum: ['Point'], // Solo "Point" está permitido
        default: "Point",
        required: true
      },
      coordinates: {
        type: [Number], // Array de números: [longitude, latitude]
        required: true
      }
    },

    destination: {
      type: {
        type: String, // Debe ser "Point"
        enum: ['Point'], // Solo "Point" está permitido
        default: "Point",
        required: true
      },
      coordinates: {
        type: [Number], // Array de números: [longitude, latitude]
        required: true
      }
    },

    distance: {
      type: Number,
      required: true
    },

    route: {
      type: {
        type: String,
        enum: ['Point'],
        default: "Point",
        required: true
      },
      coordinates: { type: [[Number]], required: true }
    },

    price: {
      type: Number,
      required: true,
    },

    payment_method: {
      type: String,
      enum: PaymentMethod,
      required: true,
    },

    service_type: {
      type: String,
      enum: ServiceType,
      required: true,
    },
    status: {
      type: String,
      enum: RequestStatus,

      default: RequestStatus.PENDING,
    },

  },
  { timestamps: true }
);

tripRequestSchema.virtual("user_info", {
  ref: "Users",
  localField: "user_id",
  foreignField: "_id",
  justOne: true,
});


tripRequestSchema.set("toObject", { virtuals: true });
tripRequestSchema.set("toJSON", { virtuals: true });

export const TripRequestModel = model<TripRequest>("TripsRequest", tripRequestSchema);
