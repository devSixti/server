import { PaymentMethodModel } from "../../../users/models";
import { AsyncCustomResponse } from "../../../common/types";
import { ErrorMsg } from "../../../common/utils";


export const getPaymentMethodsByDriverId = async (driverId: string): AsyncCustomResponse => {
    try {

        const paymentMethods = await PaymentMethodModel.find({ driverId: driverId }).select('-__v -createdAt -updatedAt');

        if (!paymentMethods) {
            throw new ErrorMsg('Payment method not found', 404);
        }

        return {
            message: `Get payment method successfully`,
            info: {
                paymentMethods
            },
        }
    } catch (error) {
        throw error;
    }
};