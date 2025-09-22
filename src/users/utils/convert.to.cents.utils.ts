import { ErrorMsg } from "../../common/utils";

export const convertToCents = (amount: string): number => {
    if (!amount) {
        throw new ErrorMsg("Amount is required", 400);
    }
    const amountNumber = parseInt(amount);

    return amountNumber * 100;
};

export const convertCentsToPesos = (cents: number): number => {
    return cents / 100;
};

export const convertAmountToNumber = (amount: string): number => {
    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount)) {
        throw new ErrorMsg(`Invalid amount format: ${amount}`, 400);
    }

    if (parsedAmount <= 0) {
        throw new ErrorMsg(`Amount must be greater than 0`, 400);
    }

    return parsedAmount;
};
