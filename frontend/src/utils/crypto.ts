
import CryptoJS from "crypto-js";

const FRONTEND_SECRET = import.meta.env.VITE_FRONTEND_SECRET || "";

export const encryptData = (data: object): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), FRONTEND_SECRET).toString();
};

export const decryptData = (encryptedData: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, FRONTEND_SECRET);
  const plaintext = bytes.toString(CryptoJS.enc.Utf8);

  if (!plaintext) {
    throw new Error("Decryption failed: invalid key or corrupted data");
  }

  return plaintext;
};