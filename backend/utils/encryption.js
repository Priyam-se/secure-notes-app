const crypto = require('crypto');

// The encryption key must be exactly 32 bytes (256 bits) long for AES-256
// We pull this from our secret environment variables
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; 

// We use aes-256-cbc (Cipher Block Chaining) which is highly secure
const ALGORITHM = 'aes-256-cbc';

/**
 * Encrypts a plain text string using AES-256-CBC.
 * @param {string} text - The raw secret message.
 * @returns {object} { iv: string, encryptedData: string }
 */
const encrypt = (text) => {
  if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
    throw new Error('Invalid ENCRYPTION_KEY length. Must be exactly 32 characters.');
  }

  // Generate a random 16-byte Initialization Vector (IV) for this specific note
  // This ensures that encrypting the same text twice yields different ciphertexts.
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
  
  let encrypted = cipher.update(text, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted
  };
};

/**
 * Decrypts an encrypted string using AES-256-CBC.
 * @param {string} encryptedData - The hex cipher text.
 * @param {string} iv - The hex initialization vector used during encryption.
 * @returns {string} The decrypted plain text.
 */
const decrypt = (encryptedData, iv) => {
  if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
    throw new Error('Invalid ENCRYPTION_KEY length. Must be exactly 32 characters.');
  }

  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), Buffer.from(iv, 'hex'));
  
  let decrypted = decipher.update(encryptedData, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  
  return decrypted;
};

module.exports = {
  encrypt,
  decrypt
};
