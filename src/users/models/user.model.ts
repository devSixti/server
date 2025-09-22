import { Schema, model } from "mongoose";
import { User } from "../../users/types";

const userSchema = new Schema<User>(
  {
    first_name: {
      type: String,
      required: false,
    },
    last_name: {
      type: String,
      required: false,
    },
    nick_name: {
      type: String,
      required: false,
      unique: true,
    },

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
      document_id: {
        type: String,
        required: false,
        default: null,
        unique: false,
      },
      front_picture: {
        type: String,
        required: false,
      },
      back_picture: {
        type: String,
        required: false,
      },
      verified: {
        type: Boolean,
        required: false,
        default: false,
      },
    },
    picture: {
      type: String,
      required: false,
    },
    birth_date: {
      type: Date,
      required: false,
    },
    country: {
      type: String,
      required: true,
      default: "CO",
    },
    city: {
      type: String,
      required: true,
      default: "Bogotá",
    },
    email: {
      address: {
        type: String,
        unique: true,
        sparse: true,
        default: null
      },
      verified: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
    phone: {
      country_code: { type: String, required: false, default: "+57" },
      // country: { type: String, required: false, default: "CO" },
      number: { type: String, required: false, unique: true },
    },
    emergency_contact: {
      country_code: { type: String, required: false },
      number: { type: String, required: false },
      name: { type: String, required: false },
    },
    address: { type: String, required: false },
    current_location: {
      type: {
          type: String, // Debe ser "Point"
          enum: ['Point'], // Solo "Point" está permitido
          default: "Point",
          required: false
      },
      coordinates: {
          type: [Number], // Array de números: [longitude, latitude]
          required: false
      }
  },
    is_active: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

// virtual atributes

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

userSchema.virtual("device", {
  ref: "Device",
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
