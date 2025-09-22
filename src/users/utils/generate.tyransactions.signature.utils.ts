
/**
 * Generates a transaction signature using bcrypt.
 * @param reference - The transaction reference (e.g., transaction ID).
 * @param amount - The transaction amount.
 * @param integritySecret - The integrity secret from environment variables.
 * @returns The bcrypt hash (signature) for the transaction.
 */

export const generateTransactionSignature = async (reference: string, amount: number): Promise<string> => {
    const hashInput = `${reference}${amount}COPtest_integrity_HR9TPsW1IWPZvShcd20vftWfw87FKHz5`;
    const encondedText = new TextEncoder().encode(hashInput);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encondedText);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return hashHex;
};
