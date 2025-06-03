import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class EncryptedHttpService {
  private readonly key = CryptoJS.SHA256("ENCRYPTION_PASSPHRASE");
  private readonly baseUrl = 'https://localhost:7241/api/x';

  constructor(private http: HttpClient) {}

  private encrypt(text: string, iv: CryptoJS.lib.WordArray): string {
    return CryptoJS.AES.encrypt(text, this.key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString();
  }

  private encryptApiPath(path: string, iv: CryptoJS.lib.WordArray): string {
    const encrypted = CryptoJS.AES.encrypt(path, this.key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    const encryptedBase64 = CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
    return encodeURIComponent(encryptedBase64);
  }

  get<T>(path: string, queryObj?: any) {
    const iv = CryptoJS.lib.WordArray.random(16);
    const encryptedPath = this.encryptApiPath(path, iv);
    const ivBase64 = CryptoJS.enc.Base64.stringify(iv);

    let queryStr = '';
    if (queryObj) {
      const queryString = new URLSearchParams(queryObj).toString();
      const encryptedQuery = this.encrypt(queryString, iv);
      queryStr = `?enc=${encodeURIComponent(encryptedQuery)}&iv=${encodeURIComponent(ivBase64)}`;
    } else {
      queryStr = `?iv=${encodeURIComponent(ivBase64)}`;
    }

    const url = `${this.baseUrl}/${encryptedPath}${queryStr}`;
    return this.http.get<T>(url);
  }

  post<T>(path: string, body: any) {
    const iv = CryptoJS.lib.WordArray.random(16);
    const encryptedPath = this.encryptApiPath(path, iv);
    const ivBase64 = CryptoJS.enc.Base64.stringify(iv);
    const encryptedBody = this.encrypt(JSON.stringify(body), iv);

    const url = `${this.baseUrl}/${encryptedPath}?iv=${encodeURIComponent(ivBase64)}`;
    return this.http.post<T>(url, encryptedBody, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
}
