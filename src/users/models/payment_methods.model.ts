import { Schema, model } from "mongoose";
import { PaymentMethod, WompiPaymentMethods } from "../../users/types";

const paymentMethodSchema = new Schema<PaymentMethod>(
  {
    driverId: {
      type: Schema.Types.ObjectId,
      ref: "Drivers",
      required: true,
    },
    token: {
      type: String,
      required: false,
    },
    paymentType: {
      type: String,
      enum: WompiPaymentMethods,
      required: true,
    },
    details: {
      type: Object,
      required: false,
    },
    is_active: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);



paymentMethodSchema.set("toObject", { virtuals: true });
paymentMethodSchema.set("toJSON", { virtuals: true });

export const PaymentMethodModel = model<PaymentMethod>("PaymentMethods", paymentMethodSchema);
