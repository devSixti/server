import { Schema, model, Document, Types } from "mongoose"; // Asegúrate de usar `Schema.Types.ObjectId`

interface WalletDocument extends Document {
  driver_id: Types.ObjectId;  // Cambia a Types.ObjectId
  balance: number;
  currency: string;
  subtractBalance(amount: number): void;
}

// Esquema de Mongoose para Wallet
const walletSchema = new Schema<WalletDocument>(
  {
    driver_id: {
      type: Schema.Types.ObjectId, // Usamos Schema.Types.ObjectId en lugar de Types.ObjectId
      ref: "Drivers", // Referencia a "Drivers"
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

// Método para restar el balance
walletSchema.methods.subtractBalance = function (amount: number): void {
  if (amount > this.balance) {
    throw new Error("No hay suficiente saldo");
  }
  this.balance -= amount;
};

// Virtuales y relaciones
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

export const WalletModel = model<WalletDocument>("Wallets", walletSchema);