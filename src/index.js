"use strict";
// index.ts
class EncryptionTool {
    algorithm;
    // KÖTÜ TASARIM: Farklı algoritmaların değişkenleri aynı sınıfa yığılmış
    aesKey = null;
    rsaPublicKey = null;
    rsaPrivateKey = null;
    constructor(algorithm) {
        // KÖTÜ TASARIM: OCP İhlali. Algoritma seçimi constructor içinde sabit (hardcoded).
        this.algorithm = algorithm;
        if (this.algorithm === 'aes') {
            this.aesKey = "super_gizli_aes_anahtari_123";
        }
        else if (this.algorithm === 'rsa') {
            // GERÇEK RSA: 'forge' kütüphanesi ile anahtar üretiyoruz
            const keypair = forge.pki.rsa.generateKeyPair({ bits: 1024, e: 0x10001 });
            this.rsaPublicKey = keypair.publicKey;
            this.rsaPrivateKey = keypair.privateKey;
        }
        else if (this.algorithm === 'base64') {
            // Base64 için ekstra anahtar gerekmiyor
        }
        else {
            throw new Error("Desteklenmeyen şifreleme algoritması!");
        }
    }
    encrypt(data) {
        // KÖTÜ TASARIM: Tüm davranışlar if-else bloklarıyla ayrılmış
        if (this.algorithm === 'aes') {
            return CryptoJS.AES.encrypt(data, this.aesKey).toString();
        }
        else if (this.algorithm === 'rsa') {
            const encryptedBytes = this.rsaPublicKey.encrypt(data);
            return forge.util.encode64(encryptedBytes);
        }
        else if (this.algorithm === 'base64') {
            return btoa(data);
        }
        return "";
    }
    decrypt(data) {
        if (this.algorithm === 'aes') {
            const bytes = CryptoJS.AES.decrypt(data, this.aesKey);
            return bytes.toString(CryptoJS.enc.Utf8);
        }
        else if (this.algorithm === 'rsa') {
            try {
                const decodedBytes = forge.util.decode64(data);
                return this.rsaPrivateKey.decrypt(decodedBytes);
            }
            catch (e) {
                return "RSA şifresi çözülemedi veya hatalı veri!";
            }
        }
        else if (this.algorithm === 'base64') {
            try {
                return atob(data);
            }
            catch (e) {
                return "Hatalı Base64 formatı!";
            }
        }
        return "";
    }
}
// --- DOM ETKİLEŞİMİ ---
document.addEventListener("DOMContentLoaded", () => {
    const algorithmSelect = document.getElementById("algorithm");
    const messageInput = document.getElementById("message");
    const encryptBtn = document.getElementById("encryptBtn");
    const decryptBtn = document.getElementById("decryptBtn");
    const resultDiv = document.getElementById("result");
    encryptBtn.addEventListener("click", () => {
        const message = messageInput.value;
        if (!message)
            return;
        resultDiv.innerText = "İşleniyor... (RSA seçiliyse biraz sürebilir)";
        setTimeout(() => {
            const tool = new EncryptionTool(algorithmSelect.value);
            resultDiv.innerText = tool.encrypt(message);
        }, 10);
    });
    decryptBtn.addEventListener("click", () => {
        const message = messageInput.value;
        if (!message)
            return;
        resultDiv.innerText = "İşleniyor... (RSA seçiliyse biraz sürebilir)";
        setTimeout(() => {
            const tool = new EncryptionTool(algorithmSelect.value);
            resultDiv.innerText = tool.decrypt(message);
        }, 10);
    });
});
