export const binaryToString = (binaryString: string): string => {

    let result = "";

    for ( let i = 0; i < binaryString.length; i += 8) {
        const byte = binaryString.slice(i, i + 8);
        const charCode = parseInt(byte, 2);
        result += String.fromCharCode(charCode);
    }

    return result;
}

export const stringToBinary = (str: string): string => {
    return str.split('').map(char => {
        const binary = char.charCodeAt(0).toString(2);
        return binary.padStart(8, '0');
    }).join('');
}


export const bitsToMegabytes = (bits: number): string => {
    return (bits / 8 / 1024 / 1024).toFixed(2) + " MB";
}