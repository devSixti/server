import { PaymentMethodModel } from "../../models";
import { envValues } from "../../../common/config";
import { AsyncCustomResponse } from "../../../common/types";
import { ErrorMsg } from "../../../common/utils";
import { PaymentMethodDataDto } from "../../dto";
import { createPaymentMethodObject } from "../../utils";

// Agregar método de pago
export const addPaymentMethod = async (driverId: string, paymentMethodData: PaymentMethodDataDto): AsyncCustomResponse => {
    try {
        const paymentMethods = await PaymentMethodModel.find({ driverId });

        if (paymentMethods.length >= 3) {
            throw new ErrorMsg('You can only have 3 payment methods', 400);
        }

        const { paymentMethodObject, details, endpoint } = await createPaymentMethodObject(driverId, paymentMethodData);

        const response = await fetch(`${envValues.wompi_api_url}/tokens/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${envValues.wompi_api_public_key}`,
            },
            body: JSON.stringify(paymentMethodObject),
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
            driverId,
            paymentType: paymentMethodData.type,
            token: data.data.id,
            is_active: data.data.status ? data.data.status === "APPROVED" : true,
            details,
        });

        if (!paymentMethod) {
            throw new ErrorMsg('Error creating payment method', 500);
        }

        return {
            status: "success",
            message: `Add payment method`,
            info: { paymentMethod },
        };
    } catch (error) {
        throw error;
    }
};

// Obtener métodos de pago
export const getPaymentMethodsByDriverId = async (driverId: string): AsyncCustomResponse => {
    try {
        const paymentMethods = await PaymentMethodModel.find({ driverId }).select('-__v -createdAt -updatedAt');

        if (!paymentMethods) {
            throw new ErrorMsg('Payment method not found', 404);
        }

        return {
            status: "success",
            message: `Get payment method successfully`,
            info: { paymentMethods },
        };
    } catch (error) {
        throw error;
    }
};
