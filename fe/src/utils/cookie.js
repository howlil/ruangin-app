import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

const SECRET_KEY = `${import.meta.env.SECRET_KEY}`; 
const COOKIE_EXPIRY = 7; 


export const encryptData = (data) => {
  try {
    const jsonString = JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};


export const decryptData = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};


export const storeUserDataInCookie = (userData, token) => {
  try {
    const dataToStore = {
      user: userData,
      token,
      timestamp: new Date().toISOString()
    };

    const encryptedData = encryptData(dataToStore);
    
    if (encryptedData) {
      Cookies.set('userData', encryptedData, { 
        expires: COOKIE_EXPIRY,
        secure: true,
        sameSite: 'strict'
      });

      Cookies.set('token', token, {
        expires: COOKIE_EXPIRY,
        secure: true,
        sameSite: 'strict'
      });
    }
  } catch (error) {
    console.error('Error storing user data:', error);
  }
};


export const getUserDataFromCookie = () => {
  try {
    const encryptedData = Cookies.get('userData');
    if (!encryptedData) return null;
    
    return decryptData(encryptedData);
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return null;
  }
};


export const clearAuthCookies = () => {
  Cookies.remove('userData');
  Cookies.remove('token');
  localStorage.removeItem("token")
};