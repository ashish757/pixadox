const ITERATIONS = 100000;
const HASH = "SHA-256";

const getPasswordKey = async (password: string): Promise<CryptoKey> => {
    const encoder = new TextEncoder();
    return window.crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );
};

const deriveAesKey = async (passwordKey: CryptoKey, salt: Uint8Array): Promise<CryptoKey> => {
    return window.crypto.subtle.deriveKey(
        { name: "PBKDF2", salt: salt as BufferSource, iterations: ITERATIONS, hash: HASH },
        passwordKey,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
};

export const encryptPayload = async (password: string, data: ArrayBuffer) => {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const passwordKey = await getPasswordKey(password);
    const aesKey = await deriveAesKey(passwordKey, salt);

    const encryptedBuffer = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv as BufferSource },
        aesKey,
        data as BufferSource
    );

    return { salt, iv, ciphertext: new Uint8Array(encryptedBuffer) };
};

export const decryptPayload = async (password: string, salt: Uint8Array, iv: Uint8Array, ciphertext: Uint8Array): Promise<ArrayBuffer> => {
    const passwordKey = await getPasswordKey(password);
    const aesKey = await deriveAesKey(passwordKey, salt);

    return window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: iv as BufferSource },
        aesKey,
        ciphertext as BufferSource
    );
};
