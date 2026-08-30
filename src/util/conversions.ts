export const binaryToString = (binaryString: string): string => {
    const bytes = new Uint8Array(binaryString.length / 8);
    for (let i = 0; i < binaryString.length; i += 8) {
        bytes[i / 8] = parseInt(binaryString.slice(i, i + 8), 2);
    }
    return new TextDecoder().decode(bytes);
}

export const stringToBinary = (str: string): string => {
    const bytes = new TextEncoder().encode(str);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
        binary += bytes[i].toString(2).padStart(8, '0');
    }
    return binary;
}


export const bitsToMegabytes = (bits: number): string => {
    return (bits / 8 / 1024 / 1024).toFixed(2) + " MB";
}

export const arrayBufferToBinary = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binaryString = '';
    for (let i = 0; i < bytes.length; i++) {
        binaryString += bytes[i].toString(2).padStart(8, '0');
    }
    return binaryString;
}

export const binaryToArrayBuffer = (binaryString: string): ArrayBuffer => {
    const bytes = new Uint8Array(binaryString.length / 8);
    for (let i = 0; i < binaryString.length; i += 8) {
        const byte = binaryString.slice(i, i + 8);
        bytes[i / 8] = parseInt(byte, 2);
    }
    return bytes.buffer;
}