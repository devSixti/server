import { Trip } from "../../trips/types";
import { WalletModel } from "../../users/models";

// Enum que define las tasas de comisión
export const enum CommissionRate {
  normal = 0.08, 
  discount = 0.05,
  promo = 0.03, 
}
// Interfaz que define el resultado de la comisión
interface CommissionResult {
  driverEarnings: number; 
  commission: number;   
  driverBalance: number;  
}
// Clase de error personalizada para manejar errores relacionados con la billetera del conductor
class DriverWalletError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DriverWalletError"; 
  }
}
// Función que calcula la comisión de un viaje, recibe el objeto `trip` y la `commissionRate`
export const calculateComission = async (
  trip: Trip, 
  commissionRate: CommissionRate = CommissionRate.normal 
): Promise<CommissionResult> => {
  
  const tripAmount = trip.final_fare; 
  const commission = tripAmount * commissionRate; 
  const driverEarnings = tripAmount - commission;
  // Validación para asegurar que tanto el conductor como la billetera del conductor existan
  if (!trip.driver || !trip.driver.wallet) {
    throw new DriverWalletError("Driver o driver wallet no encontrados"); 
  }
  const driverWallet = trip.driver.wallet;
  const wallet = new WalletModel(driverWallet); 
  // Validación del balance del conductor para asegurarse de que sea un número válido
  if (typeof wallet.balance !== "number" || wallet.balance < 0) {
    throw new DriverWalletError("El balance del conductor es inválido"); 
  }
  // Intentar restar el monto de la comisión de la billetera del conductor
  try {
    await wallet.subtractBalance(commission); 
    await wallet.save(); 
  } catch (error: unknown) {
    if (error instanceof Error) { 
      throw new DriverWalletError(`Error al actualizar el balance del conductor: ${error.message}`);
    } else { 
      throw new DriverWalletError("Error desconocido al actualizar el balance del conductor");
    }
  }
  return {
    driverEarnings,  
    commission,  
    driverBalance: wallet.balance,
  };
};