export interface PaymentMethodDataDto {
    type: string;
    number?: string;
    exp_month?: number;
    exp_year?: number;
    cvc?: string;
    card_holder?: string;
    phone_number?: string;

}