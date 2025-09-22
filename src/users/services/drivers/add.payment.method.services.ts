import { PaymentMethodModel } from "../../../users/models";
import { envValues } from "../../../common/config";
import { AsyncCustomResponse } from "../../../common/types";
import { ErrorMsg } from "../../../common/utils";
import { PaymentMethodDataDto } from "../../../users/dto";
import { createPaymentMethodObject } from "../../../users/utils";

export const addPaymentMethod = async (driverId: string, paymentMethodData: PaymentMethodDataDto): AsyncCustomResponse => {
    try {

        const paymentMethods = await PaymentMethodModel.find({ driverId: driverId });

        if (paymentMethods.length >= 3) {
            throw new ErrorMsg('You can only have 3 payment methods', 400);
        }

        const { paymentMethodObject, details, endpoint } = await createPaymentMethodObject(driverId, paymentMethodData);

        const response = await fetch(`${envValues.wompi_api_url}/tokens/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${envValues.wompi_api_public_key}`
            },
            body: JSON.stringify(paymentMethodObject)
        });

        if (!response.ok) {
            const wompiResponse = await response.json();
            if (wompiResponse.error) {
                console.error("Wompi errors: ", wompiResponse.error.messages);
                throw new ErrorMsg(`${wompiResponse.error.messages.number ?? "Review logs"}`, response.status);
            }
        }

        const data = await response.json();

        const paymentMethod = await PaymentMethodModel.create({
            driverId: driverId,
            paymentType: paymentMethodData.type,
            token: data.data.id,
            is_active: data.data.status ? data.data.status === "APPROVED" ? true : false : true,
            details: details,
        });

        if (!paymentMethod) {
            throw new ErrorMsg('Error creating payment method', 500);
        }

        return {
            message: `Add payment method`,
            info: {
                paymentMethod: paymentMethod,
            },
        }
    } catch (error) {
        throw error;
    }
};