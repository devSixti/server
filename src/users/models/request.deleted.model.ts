import { Schema, model, Types, Document } from "mongoose";

export interface IDeleteRequest extends Document {
  type: "user" | "vehicle";
  user_id: Types.ObjectId;
  vehicle_id?: Types.ObjectId;
  reason: string;
  status: "pending" | "approved" | "rejected";
  requested_at: Date;
  reviewed_at?: Date;
  reviewed_by?: Types.ObjectId;
  response_message?: string;
  createdAt: Date;
  updatedAt: Date;
}

const deleteRequestSchema = new Schema<IDeleteRequest>(
  {
    type: {
      type: String,
      enum: ["user", "vehicle"],
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    vehicle_id: {
      type: Schema.Types.ObjectId,
      ref: "Vehicles",
      required: function (this: IDeleteRequest) {
        return this.type === "vehicle";
      },
    },
    reason: {
      type: String,
      required: [true, "El motivo de eliminación es obligatorio"],
      minlength: [5, "El motivo debe tener al menos 5 caracteres"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    requested_at: {
      type: Date,
      default: Date.now,
    },
    reviewed_at: Date,
    reviewed_by: {
      type: Types.ObjectId,
      ref: "Admins",
    },
    response_message: String,
  },
  { timestamps: true }
);

export const DeleteRequestModel = model<IDeleteRequest>(
  "DeleteRequest",
  deleteRequestSchema
);