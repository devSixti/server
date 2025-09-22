import { model, Schema } from "mongoose";
import { Wallet } from "../../users/types";

const walletSchema = new Schema<Wallet>(
  {
    driver_id: {
      type: Schema.Types.ObjectId,
      ref: "Drivers",
      required: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: "COP",
    },
  },
  { timestamps: true }
)
  .set("toObject", { virtuals: true })
  .set("toJSON", { virtuals: true });

walletSchema.virtual("driver", {
  ref: "Drivers",
  localField: "driver_id",
  foreignField: "_id",
});

walletSchema.virtual("transactions", {
  ref: "Transactions",
  localField: "_id",
  foreignField: "wallet_id",
});
export const WalletModel = model<Wallet>("Wallets", walletSchema);
