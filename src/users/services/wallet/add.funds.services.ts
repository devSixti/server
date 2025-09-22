import { ErrorMsg } from "../../../common/utils";
import { envValues } from "../../../common/config";
import { AsyncCustomResponse } from "../../../common/types";
import { DriverModel, TransactionModel } from "../../../users/models";
import { convertAmountToNumber, convertToCents, generateTransactionSignature, getWompiPaymentMethodsObjectTest } from "../../../users/utils";
import { transactionStatus } from "../../../users/types";
import { AddFundsDTO } from "../../../users/dto";

export const addFunds = async (driverId: string, userData: AddFundsDTO): AsyncCustomResponse => {

    try {

        const { amount, email, paymentMethodType, acceptanceToken, authAcceptanceToken } = userData;

        const amountNumber = convertAmountToNumber(amount);

        if (amountNumber < 18000) {
            throw new ErrorMsg(`The minimum amount to add funds is $18.000 COP`, 400);
        }

        const driver = await DriverModel.findById(driverId).populate("user_info").populate("wallet");

        if (!driver) {
            throw new ErrorMsg(`Driver not found`, 404);
        }

        const { user_info, wallet } = driver;

        const transaction = await TransactionModel.create({
            wallet_id: wallet._id,
            amount: amount,
            type: paymentMethodType,
            status: transactionStatus.pending,
        });
        
        const reference = transaction._id.toString(); 
        const signature = await generateTransactionSignature(reference, convertToCents(amount)); 

        const wompiData = {
            "acceptance_token": acceptanceToken,
            "accept_personal_auth": authAcceptanceToken,
            "amount_in_cents": convertToCents(amount),
            "currency": "COP",
            "signature": signature,
            "customer_email": email,
            "reference": reference,
            "customer_data": {
                "legal_id": user_info!.document.document_id,
                "full_name": `${user_info!.first_name} ${user_info!.last_name}`,
                "phone_number": `+57${user_info!.phone?.number}`,
                "legal_id_type": user_info!.document.type,
            },
            "payment_method": await getWompiPaymentMethodsObjectTest(driverId, userData),
        }

        const response = await fetch(`${envValues.wompi_api_url}/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${envValues.wompi_api_public_key}`
            },
            body: JSON.stringify(wompiData)
        });

        if (!response.ok) {

            const wompiResponse = await response.json();
            if (wompiResponse.error) {
                console.error("Wompi errors: ", wompiResponse.error.messages);
                throw new ErrorMsg(`${wompiResponse.error.messages.acceptance_token ?? "review the logs"}`, response.status);
            }
        }

        const wompiResponse = await response.json();

        return {
            message: `Funds added successfully`,
            info: {
                transaction: wompiResponse.data
            },
        };

    } catch (error) {
        throw error;
    }
}