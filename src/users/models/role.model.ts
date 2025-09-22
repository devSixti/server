import { Schema, model } from "mongoose";
import { Roles } from "../../users/types";

const roleSchema = new Schema<Roles>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    is_active: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
 
  { timestamps: true }
);



export const RoleModel = model<Roles>("Roles", roleSchema);
