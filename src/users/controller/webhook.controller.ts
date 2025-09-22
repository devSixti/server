import { Request, Response, NextFunction } from "express";
import { TransactionModel, WalletModel } from "../../users/models";
import { transactionStatus } from "../../users/types";
import { convertAmountToNumber } from "../../users/utils";

export const wompiWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const event = req.body?.event;
    const transactionData = req.body?.data;

    if (event !== "transaction.updated") {
      return res.status(200).json({ message: "Event ignored" });
    }

    const transactionId = transactionData?.reference;
    const transactionStatusFromWompi = transactionData?.status;

    if (!transactionId || !transactionStatusFromWompi) {
      return res.status(400).json({ message: "Missing data from Wompi" });
    }

    const transaction = await TransactionModel.findById(transactionId);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.status === transactionStatus.completed) {
      return res.status(200).json({ message: "Transaction already processed" });
    }

    if (transactionStatusFromWompi === "APPROVED") {
      const wallet = await WalletModel.findById(transaction.wallet_id);
      if (!wallet) {
        return res.status(404).json({ message: "Wallet not found" });
      }

      const currentBalance = wallet.balance || 0;
      const amountToAdd = transaction.amount;

      wallet.balance = currentBalance + amountToAdd;
      await wallet.save();

      transaction.status = transactionStatus.completed;
      await transaction.save();

      return res.status(200).json({ message: "Wallet updated successfully" });
    }

    return res.status(200).json({ message: "Transaction not approved" });
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
