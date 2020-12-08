import * as CryptoJS from 'crypto-js';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EncryptionService {
  constructor() {}
  encryptData(data) {
    try {
      return CryptoJS.AES.encrypt(
        JSON.stringify(data),
        environment.secretCode
      ).toString();
    } catch (e) {
      console.log(e);
    }
  }
  decryptData(data) {
    try {
      const bytes = CryptoJS.AES.decrypt(data, environment.secretCode);
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
      return data;
    } catch (e) {
      console.log(e);
    }
  }
}
