const nearestOdd = (num: number): number => {
    return num % 2 === 0 ? num - 1 : num;
}


const nearestEven = (num: number): number => {
    return num % 2 === 0 ? num : num - 1;
}


export const dataTypes = {
    text: 1,
    image: 2,
    audio: 3
}

export const encodeImage = (imageData: ImageData, binary: string, type: "text" | "image" | "audio" = "text") => {
    const pixels = imageData.data;
    // i am thinking to store the length of the data being stored in the first 32 bits and the type of data being stored in the next 8 bits
    // that is actual data will be stored after 40 bits of the image data
    // planning to be able to store small image or audio inside image, that will be cool

    const dataSize = binary.length;
    const binarySize = dataSize.toString(2).padStart(32, '0');


    const dataType: number = dataTypes[type];
    const binaryDataType = dataType.toString(2).padStart(8, '0');

    const marker = "%PI#XL%"; // 7 * 8 = 56 bits
    const binaryMarker = marker.split('').map(char => {
        const binary = char.charCodeAt(0).toString(2);
        return binary.padStart(8, '0');
    });


    const dataToEncode = binaryMarker + binarySize + binaryDataType + binary;
    // 56 + 32 + 8 = 96 bits of data will be used for storing the marker, size and type of data


    for(let i =0; i<dataToEncode.length; i++) {
        if(dataToEncode[i] === '1') {
            pixels[i] = nearestOdd(pixels[i]);
        } else {
            pixels[i] = nearestEven(pixels[i]);
        }
    }

    return imageData;

}


