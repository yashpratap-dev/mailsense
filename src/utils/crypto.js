// import crypto from 'crypto';

// const algorithm = 'aes-256-cbc';
// const secretKeyHex = process.env.TOKEN_ENCRYPTION_KEY; // Ensure this is a 64-char hex string
// const secretKey = Buffer.from(secretKeyHex, 'hex'); // Convert to a 32-byte Buffer
// const ivLength = 16; // AES block size

// if (secretKey.length !== 32) {
//   throw new Error('Encryption key must be exactly 32 bytes long. Check TOKEN_ENCRYPTION_KEY.');
// }

// // Encrypt a token
// export function encryptToken(token) {
//   const iv = crypto.randomBytes(ivLength); // Generate random IV
//   const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

//   let encrypted = cipher.update(token, 'utf8', 'hex');
//   encrypted += cipher.final('hex');

//   return {
//     iv: iv.toString('hex'), // Store IV for decryption
//     encryptedData: encrypted,
//   };
// }

// // Decrypt a token
// export function decryptToken(encrypted) {
//   const { iv, encryptedData } = encrypted;
//   const decipher = crypto.createDecipheriv(
//     algorithm,
//     secretKey,
//     Buffer.from(iv, 'hex')
//   );

//   let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
//   decrypted += decipher.final('utf8');

//   return decrypted;
// }








import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const ivLength = 16;

function getSecretKey() {
  const hex = process.env.TOKEN_ENCRYPTION_KEY;
  if (!hex) throw new Error('TOKEN_ENCRYPTION_KEY is not set');
  const key = Buffer.from(hex, 'hex');
  if (key.length !== 32) throw new Error('TOKEN_ENCRYPTION_KEY must be 64 hex chars');
  return key;
}

// Encrypt a token
export function encryptToken(token) {
  const secretKey = getSecretKey();
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return {
    iv: iv.toString('hex'), // Store IV for decryption
    encryptedData: encrypted,
  };
}

// Decrypt a token
export function decryptToken(encrypted) {
  const { iv, encryptedData } = encrypted;

  // Ensure both `iv` and `encryptedData` exist
  if (!iv || !encryptedData) {
    throw new Error('Invalid encrypted token format.');
  }

  const secretKey = getSecretKey();
  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(iv, 'hex')
  );

  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
