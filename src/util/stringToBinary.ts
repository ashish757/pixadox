export const stringToBinary = (str: string): string => {
    return str.split('').map(char => {
        const binary = char.charCodeAt(0).toString(2);
        return binary.padStart(8, '0');
    }).join('');
}