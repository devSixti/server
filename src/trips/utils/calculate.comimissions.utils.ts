import { Trip } from "../../trips/types";

export const enum CommissionRate {
    normal = 0.08,
    discount = 0.05,
    promo = 0.03
}

interface CommissionResult {
    driverEarnings: number;
    commission: number;
    driverBalance: number;
}

export const calculateComission = (trip: Trip): CommissionResult => {

    const tripAmount = trip.final_fare;
    const commissionRate = CommissionRate.normal;
    const commission = tripAmount * commissionRate;
    const driverEarnings = tripAmount - commission;

    const driverWallet = trip?.driver.wallet;

    driverWallet.balance -= commission

    return {
        driverEarnings,
        commission,
        driverBalance: driverWallet.balance
    
    }
}