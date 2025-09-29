import { Schema, model, Types, Document } from "mongoose";

export interface IDeleteRequest extends Document {
  user_id: Types.ObjectId;
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
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    reason: {
      type: String,
      default: "El usuario ha solicitado la eliminación de su cuenta.",
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
    reviewed_at: {
      type: Date,
    },
    reviewed_by: {
      type: Types.ObjectId,
      ref: "Admin",
    },
    response_message: {
      type: String,
    },
  },
  { timestamps: true }
);

export const DeleteRequestModel = model<IDeleteRequest>(
  "DeleteRequest",
  deleteRequestSchema
);
