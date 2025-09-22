import { AddFundsDTO } from "../../users/dto";
import { PaymentMethodsObject, WompiPaymentMethods } from "../../users/types";
import { PaymentMethodModel } from "../../users/models";
import { ErrorMsg } from "../../common/utils";

export const getWompiPaymentMethodsObjectTest = async (driverId: string, userData: AddFundsDTO): Promise<PaymentMethodsObject> => {

    const { paymentMethodType, installments, paymentMethodToken } = userData;

    const paymentMethod = await PaymentMethodModel.findOne({token: paymentMethodToken });

    if (!paymentMethod) {
        throw new ErrorMsg(`Payment method not found`, 404);
    }

    if (paymentMethod.is_active === false) {
        throw new ErrorMsg(`Payment method is not active`, 400);
    }

    if (paymentMethod.paymentType !== paymentMethodType) {
        throw new ErrorMsg(`Payment method type does not match`, 400);
    }

    switch (paymentMethodType) {

        case WompiPaymentMethods.NEQUI:

        const phone_number = paymentMethod.details?.phone_number ?? '3991111111';
            return {
                type: WompiPaymentMethods.NEQUI,
                phone_number: phone_number
            };

        case WompiPaymentMethods.CARD:
            return {
                type: WompiPaymentMethods.CARD,
                installments: installments ?? 1,
                token: paymentMethodToken
            };
        // case WompiPaymentMethods.PSE:
        //     return {
        //         type: WompiPaymentMethods.PSE,
        //         user_type: 0, // Tipo de persona, natural (0) o jurídica (1)
        //         user_legal_id_type: 'CC', // Tipo de documento, CC o NIT
        //         user_legal_id: '1999888777', // Número de documento
        //         financial_institution_code: '1', // "1" para transacciones APROBADAS, "2" para transacciones DECLINADAS
        //         payment_description: 'Pago a Tienda Wompi' // Nombre de lo que se está pagando. Máximo 30 caracteres
        //     };
        // case WompiPaymentMethods.BANCOLOMBIA_TRANSFER:
        //     return {
        //         type: WompiPaymentMethods.BANCOLOMBIA_TRANSFER,
        //         payment_description: 'Pago a Tienda Wompi' // Nombre de lo que se está pagando. Máximo 64 caracteres
        //     };
        // case WompiPaymentMethods.BANCOLOMBIA_QR:
        //     return {
        //         type: WompiPaymentMethods.BANCOLOMBIA_QR,
        //         payment_description: 'Pago a Tienda Wompi', // Nombre de lo que se está pagando. Máximo 64 caracteres
        //         sandbox_status: 'APPROVED' // Status final deseado en el Sandbox. Uno de los siguientes: APPROVED, DECLINED o ERROR
        //     };
        // case WompiPaymentMethods.PCOL:
        //     return {
        //         type: WompiPaymentMethods.PCOL,
        //         sandbox_status: 'APPROVED_ONLY_POINTS' // Status final deseado en el Sandbox.
        //     };

        default:
            throw new ErrorMsg(`Payment method not found`, 404);
    }
}
