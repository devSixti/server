import { model, Schema } from "mongoose";
import { Transaction, transactionStatus, WompiPaymentMethods } from "../../users/types";


const transactionSchema = new Schema<Transaction>({
    wallet_id: {
        type: Schema.Types.ObjectId,
        ref: "Wallets",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: WompiPaymentMethods,
    },
    status: {
        type: String,
        default: transactionStatus.pending,
        enum: transactionStatus,
    },

}, { timestamps: true })

    .set("toObject", { virtuals: true })
    .set("toJSON", { virtuals: true });

export const TransactionModel = model<Transaction>("Transactions", transactionSchema);