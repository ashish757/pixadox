export const bitsToMegabytes = (bits: number): string => {
    return (bits / 8 / 1024 / 1024).toFixed(2) + " MB";
}