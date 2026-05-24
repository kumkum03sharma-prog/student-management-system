import CryptoJS from "crypto-js";

const FRONTEND_SECRET = process.env.FRONTEND_SECRET || "";
const BACKEND_SECRET = process.env.BACKEND_SECRET || "";

if (!FRONTEND_SECRET || !BACKEND_SECRET) {
  throw new Error("FRONTEND_SECRET and BACKEND_SECRET must be set in .env");
}

// ── L1 DECRYPT ───────────────────────────────────────────
// Undoes frontend AES encryption
// Input:  AES encrypted string (frontend encrypted with FRONTEND_SECRET)
// Output: raw JSON plaintext string
export const firstDecrypt = (encryptedData: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, FRONTEND_SECRET);
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);

    if (!plaintext) {
      throw new Error("Empty result after decryption");
    }

    // Validate it's proper JSON
    JSON.parse(plaintext);

    return plaintext;
  } catch (error) {
    throw new Error(
      "Level-1 decryption failed: invalid frontend key or corrupted payload",
    );
  }
};

// ── L2 ENCRYPT ───────────────────────────────────────────
// Wraps plaintext with BACKEND_SECRET before storing in MongoDB
// Input:  raw JSON plaintext string
// Output: AES encrypted string (stored in MongoDB)
export const secondEncrypt = (plaintext: string): string => {
  try {
    return CryptoJS.AES.encrypt(plaintext, BACKEND_SECRET).toString();
  } catch (error) {
    throw new Error("Level-2 encryption failed");
  }
};

// ── L2 DECRYPT + L1 RE-ENCRYPT ───────────────────────────
// Fetches from MongoDB, decrypts with BACKEND_SECRET,
// then re-encrypts with FRONTEND_SECRET so frontend can decrypt it
// Input:  L2 encrypted string (from MongoDB)
// Output: L1 encrypted string (frontend will decrypt with FRONTEND_SECRET)
export const secondDecrypt = (encryptedData: string): string => {
  try {
    // Step 1 — decrypt with BACKEND_SECRET → plaintext
    const bytes = CryptoJS.AES.decrypt(encryptedData, BACKEND_SECRET);
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);

    if (!plaintext) {
      throw new Error("Empty result after decryption");
    }

    // Step 2 — re-encrypt with FRONTEND_SECRET → L1 encrypted
    return CryptoJS.AES.encrypt(plaintext, FRONTEND_SECRET).toString();
  } catch (error) {
    throw new Error(
      "Level-2 decryption failed: invalid backend key or corrupted payload",
    );
  }
};