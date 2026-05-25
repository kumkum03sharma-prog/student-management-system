import CryptoJS from "crypto-js";

const FRONTEND_SECRET = process.env.FRONTEND_SECRET || "";
const BACKEND_SECRET = process.env.BACKEND_SECRET || "";

if (!FRONTEND_SECRET || !BACKEND_SECRET) {
  throw new Error("FRONTEND_SECRET and BACKEND_SECRET must be set in .env");
}


export const firstDecrypt = (encryptedData: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, FRONTEND_SECRET);
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);

    if (!plaintext) {
      throw new Error("Empty result after decryption");
    }


    JSON.parse(plaintext);

    return plaintext;
  } catch (error) {
    throw new Error(
      "Level-1 decryption failed: invalid frontend key or corrupted payload",
    );
  }
};


export const secondEncrypt = (plaintext: string): string => {
  try {
    return CryptoJS.AES.encrypt(plaintext, BACKEND_SECRET).toString();
  } catch (error) {
    throw new Error("Level-2 encryption failed");
  }
};


export const secondDecrypt = (encryptedData: string): string => {
  try {

    const bytes = CryptoJS.AES.decrypt(encryptedData, BACKEND_SECRET);
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);

    if (!plaintext) {
      throw new Error("Empty result after decryption");
    }


    return CryptoJS.AES.encrypt(plaintext, FRONTEND_SECRET).toString();
  } catch (error) {
    throw new Error(
      "Level-2 decryption failed: invalid backend key or corrupted payload",
    );
  }
};