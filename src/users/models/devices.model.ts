import { model, Schema } from "mongoose";
import { Device } from "../../users/types";

const DeviceSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const DeviceModel = model<Device>("Device", DeviceSchema);
