export const imageToBinary = (imageData: ImageData): string => {

    let binaryString = "";

    // const len = imageData.data.length;
    const len = 100;
    for (let i = 0; i < len; i++) {
        binaryString += imageData.data[i] % 2;
    }

    return binaryString;
}



