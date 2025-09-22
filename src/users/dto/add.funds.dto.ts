export interface AddFundsDTO {
    amount: string;
    email: string;
    paymentMethodType: string;
    installments?: number;
    paymentMethodToken?: string;
    acceptanceToken: string;
    authAcceptanceToken: string;
}