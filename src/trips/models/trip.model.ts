import { model, Schema } from "mongoose";
import { Trip, TripStatus } from "../types";

// Definición del esquema del viaje
const tripSchema = new Schema<Trip>(
  {
    // Referencias a otros documentos
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
    discount_id: {
      type: Schema.Types.ObjectId,
      ref: "Discounts",
    },
    // Campos numéricos
    total_fare: {
      type: Number, // Tarifa total del viaje
      required: true,
    },
    final_fare: {
      type: Number, // Tarifa final del viaje (después de aplicar descuentos)
      required: true,
    },
    // Campo de estado
    status: {
      type: String,
      required: true,
      enum: Object.values(TripStatus),
    },
    acceptedAt: {
      type: Date, // Fecha en la que se acepta el viaje
    },
  },
  { timestamps: true }
);
// Virtuals: relaciones de los viajes con otros modelos
tripSchema.virtual("driver", {
  ref: "Drivers",
  localField: "driver_id",
  foreignField: "_id",
  justOne: true,
});
// Virtual para el pasajero del viaje
tripSchema.virtual("passenger", {
  ref: "Users",
  localField: "passenger_id",
  foreignField: "_id",
  justOne: true,
});
// Índices para optimizar las consultas más frecuentes
tripSchema.index({ passenger_id: 1 }); // Indexado de passenger_id para búsquedas rápidas
tripSchema.index({ driver_id: 1 }); // Indexado de driver_id para búsquedas rápidas
tripSchema.index({ status: 1 }); // Indexado de status para consultas por estado de viaje
export const TripModel = model<Trip>("Trips", tripSchema);