import { Schema } from "mongoose";

export enum WompiPaymentMethods {
    NEQUI = 'NEQUI',
    PSE = 'PSE',
    BANCOLOMBIA_TRANSFER = 'BANCOLOMBIA_TRANSFER',
    BANCOLOMBIA_QR = 'BANCOLOMBIA_QR',
    PCOL = 'PCOL',
    CARD = 'CARD',
    CASH = 'CASH'

}

export interface PaymentMethodsObject {
    type: WompiPaymentMethods,
    phone_number?: string,
    user_type?: number,
    user_legal_id_type?: string,
    user_legal_id?: string,
    financial_institution_code?: string,
    payment_description?: string,
    sandbox_status?: string,
    installments?: number,
    token?: string
}

export interface PaymentMethod {
    _id?: string;
    token?: string;
    driverId: Schema.Types.ObjectId;
    paymentType: string;
    details?: Record<string, any>;
    is_active: boolean;
}
