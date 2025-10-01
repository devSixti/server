import { Schema, model } from "mongoose";
import { User } from "../../users/types";

const userSchema = new Schema<User>(
  {
    first_name: { type: String },
    last_name: { type: String },
    nick_name: { type: String, unique: true },

    role_id: {
      type: Schema.Types.ObjectId,
      ref: "Roles",
      required: true,
    },

    document: {
      type: {
        type: String,
        required: false,
      },
      document_id: { type: String, default: null },
      front_picture: String,
      back_picture: String,
      verified: { type: Boolean, default: false },
    },

    picture: String,
    birth_date: Date,
    country: { type: String, default: "CO" },
    city: { type: String, default: "Bogotá" },

    email: {
      address: { type: String, unique: true, sparse: true, default: null },
      verified: { type: Boolean, default: false },
    },

    phone: {
      country_code: { type: String, default: "+57" },
      number: { type: String, unique: true },
    },

    emergency_contact: {
      country_code: String,
      number: String,
      name: String,
    },

    address: String,

    current_location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: [Number], // [longitude, latitude]
    },

    is_active: { type: Boolean, default: true },

    device: {
      type: Schema.Types.ObjectId,
      ref: "Device",
      required: false,
    },
  },
  { timestamps: true }
);

// Virtuals 
userSchema.virtual("role", {
  ref: "Roles",
  localField: "role_id",
  foreignField: "_id",
  justOne: true,
});

userSchema.virtual("driver", {
  ref: "Drivers",
  localField: "_id",
  foreignField: "user_id",
  justOne: true,
});

userSchema.virtual("discounts", {
  ref: "Discounts",
  localField: "_id",
  foreignField: "user_id",
});

userSchema.virtual("califications", {
  ref: "Califications",
  localField: "_id",
  foreignField: "to_user_id",
});

userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });
userSchema.index({ current_location: "2dsphere" });

export const UserModel = model<User>("Users", userSchema);
