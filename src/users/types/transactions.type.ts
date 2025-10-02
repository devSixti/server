import { Types } from "mongoose";
import { WompiPaymentMethods } from "./wompi.payment.method.type";

export interface Transaction {
    wallet_id: Types.ObjectId;
    amount: number;
    type: WompiPaymentMethods;
    status?: transactionStatus;
    createdAt?: Date;
    updatedAt?: Date;
}

export enum transactionStatus {
    pending = "pending",
    completed = "completed",
    failed = "failed",
}