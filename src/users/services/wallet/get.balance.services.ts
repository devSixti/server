import { ErrorMsg } from "../../../common/utils";
import { envValues } from "../../../common/config";
import { AsyncCustomResponse } from "../../../common/types";
import { TransactionModel, WalletModel } from "../../../users/models";
import { transactionStatus } from "../../../users/types";
import { convertCentsToPesos } from "../../../users/utils";


export const getBalance = async (transaccionReference?: string): AsyncCustomResponse => {
    try {
        // 1. Checks if a transaction reference is provided.
        if (!transaccionReference) {
            throw new ErrorMsg(`Reference is required`, 400);
        }

        // 2. Searches for the transaction in the database using the TransactionModel.
        const apiTransaction = await TransactionModel.findById(transaccionReference);

        // 3. Throws an error if the transaction is not found.
        if (!apiTransaction) {
            throw new ErrorMsg(`Transaction not found`, 404);
        }

        if (apiTransaction.status === transactionStatus.completed) {
            throw new ErrorMsg(`Transaction already completed`, 400);
        }

        // 4. Makes a GET request to the Wompi API to fetch transaction details.
        const response = await fetch(`${envValues.wompi_api_url}/transactions/?reference=${transaccionReference}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${envValues.wompi_api_private_key}`
            },
        });

        // 5. Checks if the API response is not successful.
        if (!response.ok) {
            const wompiResponse = await response.json();

            // 5.1. If there is an error in the Wompi response, logs the error and throws an exception.
            if (wompiResponse.error) {
                console.error("Wompi errors: ", wompiResponse.error);
                throw new ErrorMsg(`${wompiResponse.error.messages ?? "review the logs"}`, response.status);
            }
        }

        // 6. Parses the data from the API response.
        const { data } = await response.json();

        const wompiTransaction = data[0];

        // 7. Searches for the wallet associated with the transaction in the database.
        const wallet = await WalletModel.findById(apiTransaction!.wallet_id);


        // 8. Throws an error if the wallet is not found.
        if (!wallet) {
            throw new ErrorMsg(`Wallet not found`, 404);
        }

        const oldBalance = wallet.balance;
        let newBalance = oldBalance;

        // 9. If the transaction status is "APPROVED", updates the wallet balance.
        if (wompiTransaction.status === "APPROVED") {
            wallet.balance += convertCentsToPesos(wompiTransaction.amount_in_cents);
            apiTransaction!.status = transactionStatus.completed;
            await apiTransaction!.save();
            await wallet.save();
            newBalance = wallet.balance;
        }

        let asyncPaymentUrl = null;
        const { payment_method } = wompiTransaction;

        if (payment_method && payment_method.extra && payment_method.extra.async_payment_url) {
            asyncPaymentUrl = wompiTransaction.payment_method.extra.async_payment_url;
        }

        // 10. Returns a success response with the fetched wompiTransaction.
        return {
            status: "success",
            message: `Get balance successful`,
            info: {
                statusWompiTransaction: wompiTransaction.status,
                statusApiTransaction: apiTransaction!.status,
                paymentMethodUsed: payment_method,
                asyncPaymentUrl: asyncPaymentUrl,
                oldBalance,
                newBalance,
            },
        };

    } catch (error) {

        throw (error);
    }
};
