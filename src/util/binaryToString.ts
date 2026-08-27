export const binaryToString = (binaryString: string): string => {

    let result = "";

    for ( let i = 0; i < binaryString.length; i += 8) {
        const byte = binaryString.slice(i, i + 8);
        const charCode = parseInt(byte, 2);
        result += String.fromCharCode(charCode);
    }

    return result;
}