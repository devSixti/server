import { ErrorMsg } from "../../common/utils";
import { PaymentMethodDataDto } from "../../users/dto";
import { PaymentMethodModel } from "../../users/models";

export async function createPaymentMethodObject(driverId: string, paymentMethodData: PaymentMethodDataDto) {
    const { type, ...restPaymentMethod } = paymentMethodData;
    let paymentMethodObject;
    let details = {} as Record<string, string>;
    let endpoint = "" as string;

    switch (type) {
        case "CARD":
            const { number, exp_month, exp_year, card_holder, cvc } = restPaymentMethod as PaymentMethodDataDto;

            if (!number || !exp_month || !exp_year || !cvc) {
                throw new ErrorMsg(`Missing required fields for CARD payment method`, 400);
            }

            paymentMethodObject = {
                number: number,
                cvc: cvc,
                exp_month: exp_month,
                exp_year: exp_year,
                card_holder: card_holder
            };

            endpoint = "cards";

            details.last4 = paymentMethodObject?.number?.slice(-4);

            break;

        case "NEQUI":
            const { phone_number } = restPaymentMethod as PaymentMethodDataDto;

            if (!phone_number) {
                throw new ErrorMsg(`Missing required fields for NEQUI payment method`, 400);
            }

            const paymentMethod = await PaymentMethodModel.findOne({
                driverId: driverId,
                "details.phone_number": phone_number,
            });

            console.log("Payment method: ", paymentMethod);

            if (paymentMethod) {
                throw new ErrorMsg(`Driver already has a payment method with this phone number`, 400);
            }

            paymentMethodObject = {
                phone_number: phone_number,
            };

            details.phone_number = paymentMethodObject?.phone_number;

            endpoint = "nequi";

            break;

        default:
            throw new ErrorMsg(`Payment method type ${type} not supported`, 400);
    }

    return { paymentMethodObject, details, endpoint };
}