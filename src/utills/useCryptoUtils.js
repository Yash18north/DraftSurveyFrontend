import CryptoJS from "crypto-js";

// Define your secret key (ensure it's 32 bytes long)
const secretKey = 'TCRCLMSAPP2024'.padEnd(32, '\0');  // JavaScript version of padding
// const secretKey = process.env.REACT_APP_SECRET_KEY;

const encryptData = (data) => {
  const key = CryptoJS.enc.Utf8.parse(secretKey);  // Ensure secretKey is correct and full-length
  const iv = CryptoJS.lib.WordArray.random(16);    // Correct, generates a new IV for each encryption

  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7  // This should handle padding
  });

  // Encode the combined IV and ciphertext in Base64
  const ivAndCiphertext = CryptoJS.enc.Base64.stringify(iv.concat(encrypted.ciphertext));
  return ivAndCiphertext;
  
  
};

const decryptData = (encryptedData) => {
  try{
    if (typeof encryptedData !== "string") {
      throw new TypeError("encryptedData should be a Base64 encoded string");
    }
    const encryptedDataBytes = CryptoJS.enc.Base64.parse(encryptedData);
    const iv = CryptoJS.lib.WordArray.create(
      encryptedDataBytes.words.slice(0, 4)
    );
    const encryptedMessage = CryptoJS.lib.WordArray.create(
      encryptedDataBytes.words.slice(4)
    );
  
    const key = CryptoJS.enc.Utf8.parse(secretKey);
  
    const decrypted = CryptoJS.AES.decrypt(
      {
        ciphertext: encryptedMessage,
      },
      key,
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    const decryptedData = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  }
  catch(ex){
  }
};
const encryptDataForURL = (plainTextOrNumber) => {
  // return plainTextOrNumber
  if(!plainTextOrNumber){
    return '';
  }
  const plainText = plainTextOrNumber.toString(); // Convert to string if it's a number
    const ciphertext = CryptoJS.AES.encrypt(plainText, secretKey).toString();
    
    // Make it URL-safe by replacing characters
    const base64Ciphertext = ciphertext.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return base64Ciphertext;
};

const decryptDataForURL = (ciphertext) => {
  // return ciphertext;
  if(!ciphertext){
    return ""
  }
  const base64Ciphertext = ciphertext.replace(/-/g, '+').replace(/_/g, '/');
    
    // Decrypt the string
    const bytes = CryptoJS.AES.decrypt(base64Ciphertext, secretKey);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    
    return decryptedText;
};
export { encryptData, decryptData,encryptDataForURL,decryptDataForURL };

