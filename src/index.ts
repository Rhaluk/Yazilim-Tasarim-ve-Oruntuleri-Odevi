declare const CryptoJS: any;
declare const forge: any;

//tanrı class her şeyi yapıyot parametre alarak
class EncryptionTool {
    public algorithm: string;


    private aesKey: string | null = null;
    private rsaPublicKey: any = null;
    private rsaPrivateKey: any = null;

    constructor(algorithm: string) {

        this.algorithm = algorithm;

        if (this.algorithm === 'aes') {
            this.aesKey = "super_gizli_aes_anahtari_123";
        } else if (this.algorithm === 'rsa') {

            const keypair = forge.pki.rsa.generateKeyPair({ bits: 1024, e: 0x10001 });
            this.rsaPublicKey = keypair.publicKey;
            this.rsaPrivateKey = keypair.privateKey;
        } else if (this.algorithm === 'base64') {

        } else {
            throw new Error("Desteklenmeyen şifreleme algoritması!");
        }
    }

    public encrypt(data: string): string {

        if (this.algorithm === 'aes') {
            return CryptoJS.AES.encrypt(data, this.aesKey!).toString();
        } else if (this.algorithm === 'rsa') {
            const encryptedBytes = this.rsaPublicKey.encrypt(data);
            return forge.util.encode64(encryptedBytes);
        } else if (this.algorithm === 'base64') {
            return btoa(data);
        }
        return "";
    }

    public decrypt(data: string): string {
        if (this.algorithm === 'aes') {
            const bytes = CryptoJS.AES.decrypt(data, this.aesKey!);
            return bytes.toString(CryptoJS.enc.Utf8);
        } else if (this.algorithm === 'rsa') {
            try {
                const decodedBytes = forge.util.decode64(data);
                return this.rsaPrivateKey.decrypt(decodedBytes);
            } catch (e) {
                return "RSA şifresi çözülemedi veya hatalı veri!";
            }
        } else if (this.algorithm === 'base64') {
            try {
                return atob(data);
            } catch (e) {
                return "Hatalı Base64 formatı!";
            }
        }
        return "";
    }
}

//DOM ETKİLEŞİMİ
document.addEventListener("DOMContentLoaded", () => {
    const algorithmSelect = document.getElementById("algorithm") as HTMLSelectElement;
    const messageInput = document.getElementById("message") as HTMLTextAreaElement;
    const encryptBtn = document.getElementById("encryptBtn") as HTMLButtonElement;
    const decryptBtn = document.getElementById("decryptBtn") as HTMLButtonElement;
    const resultDiv = document.getElementById("result") as HTMLDivElement;

    encryptBtn.addEventListener("click", () => {
        const message = messageInput.value;
        if (!message) return;



        setTimeout(() => {
            const tool = new EncryptionTool(algorithmSelect.value);
            resultDiv.innerText = tool.encrypt(message);
        }, 10);
    });

    decryptBtn.addEventListener("click", () => {
        const message = messageInput.value;
        if (!message) return;



        setTimeout(() => {
            const tool = new EncryptionTool(algorithmSelect.value);
            resultDiv.innerText = tool.decrypt(message);
        }, 10);
    });
});