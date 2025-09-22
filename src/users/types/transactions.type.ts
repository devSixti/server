import { ObjectId } from "mongoose";

export interface Transaction {
    wallet_id: ObjectId;
    amount: number;
    type: "credit" | "debit";
    status?: "pending" | "completed" | "failed";
    createdAt?: Date;
    updatedAt?: Date;
}

export enum transactionStatus {
    pending = "pending",
    completed = "completed",
    failed = "failed",
}