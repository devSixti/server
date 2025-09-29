import { model, Schema } from "mongoose";
import { PaymentMethod, RequestStatus, TripRequest } from "../types";
import { ServiceType } from "../../common/types";

// Definición del esquema de solicitud de viaje
const tripRequestSchema = new Schema<TripRequest>(
  {
    // Referencia al usuario
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    // Ubicación de origen
    origin: {
      type: {
        type: String,
        enum: ['Point'],
        default: "Point",
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      }
    },
    // Ubicación de destino
    destination: {
      type: {
        type: String,
        enum: ['Point'],
        default: "Point",
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      }
    },
    // Distancia del viaje
    distance: {
      type: Number,
      required: true,
    },
    route: {
      type: {
        type: String,
        enum: ['Point'],
        default: "Point",
        required: true,
      },
      coordinates: { type: [[Number]], required: true },
    },
    // Método de pago
    payment_method: {
      type: String,
      enum: PaymentMethod,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    service_type: {
      type: String,
      enum: ServiceType,
      required: true,
    },
    // Estado de la solicitud
    status: {
      type: String,
      enum: RequestStatus,
      default: RequestStatus.PENDING,
    },
  },
  { timestamps: true }
);
// Índices geoespaciales para optimizar las búsquedas basadas en coordenadas
tripRequestSchema.index({ "origin.coordinates": "2dsphere" });
tripRequestSchema.index({ "destination.coordinates": "2dsphere" });
tripRequestSchema.index({ "route.coordinates": "2dsphere" });
// Virtual para obtener información del usuario
tripRequestSchema.virtual("user_info", {
  ref: "Users",
  localField: "user_id",
  foreignField: "_id",
  justOne: true,
});
// Configurar las opciones para la conversión a JSON/Objeto
tripRequestSchema.set("toObject", { virtuals: true });
tripRequestSchema.set("toJSON", { virtuals: true });

export const TripRequestModel = model<TripRequest>("TripsRequest", tripRequestSchema);