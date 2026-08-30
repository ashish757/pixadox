// import { binaryToString, binaryToArrayBuffer } from "./conversions";
//
// export interface DecodedImageData {
//     data: string | Blob;
//     dataSize: number;
//     dataType: number;
// }
//
// export const decodeImage = (imageData: ImageData): DecodedImageData => {
//     const pixels = imageData.data;
//
//     let markerBinary = "";
//     for (let i = 0; i < 56; i++) {
//         if(i >= pixels.length) break;
//         markerBinary += pixels[i] % 2;
//     }
//
//     if (binaryToString(markerBinary) !== "%PI#XL%") {
//         return { data: "", dataSize: 0, dataType: 0 };
//     }
//
//     let dataSizeBinary = "";
//     let dataTypeBinary = "";
//
//     for (let i = 56; i < 88; i++) {
//         dataSizeBinary += pixels[i] % 2;
//     }
//
//     for (let i = 88; i < 96; i++) {
//         dataTypeBinary += pixels[i] % 2;
//     }
//
//     const dataSize = parseInt(dataSizeBinary, 2);
//     const dataType = parseInt(dataTypeBinary, 2);
//
//     let dataBinary = "";
//     for (let i = 96; i < dataSize + 96; i++) {
//         if(i >= pixels.length) break;
//         dataBinary += pixels[i] % 2;
//     }
//
//     let extractedData: string | Blob;
//
//     if (dataType === 1) {
//         extractedData = binaryToString(dataBinary);
//     } else {
//         const buffer = binaryToArrayBuffer(dataBinary);
//         let mimeType = "application/octet-stream";
//         if (dataType === 2) mimeType = "image/png";
//         if (dataType === 3) mimeType = "audio/mpeg";
//
//         extractedData = new Blob([buffer], { type: mimeType });
//     }
//
//     return {
//         data: extractedData,
//         dataSize: dataSize,
//         dataType: dataType
//     };
// }

import { binaryToString, binaryToArrayBuffer } from "./conversions.ts";

export interface DecodedImageData {
    data: string | Blob;
    dataSize: number;
    dataType: number;
}

export const decodeImage = (imageData: ImageData): DecodedImageData => {
    const pixels = imageData.data;
    let pixelIndex = 0;

    const readBits = (count: number): string => {
        let bits = "";
        let bitsRead = 0;

        while (bitsRead < count && pixelIndex < pixels.length) {
            if ((pixelIndex + 1) % 4 === 0) {
                pixelIndex++;
                continue;
            }
            bits += pixels[pixelIndex] % 2;
            pixelIndex++;
            bitsRead++;
        }
        return bits;
    }

    const markerBinary = readBits(56);

    if (binaryToString(markerBinary) !== "%PI#XL%") {
        return { data: "", dataSize: 0, dataType: 0 };
    }

    const dataSize = parseInt(readBits(32), 2);
    const dataType = parseInt(readBits(8), 2);
    const dataBinary = readBits(dataSize);

    let extractedData: string | Blob;

    if (dataType === 1) {
        extractedData = binaryToString(dataBinary);
    } else {
        const buffer = binaryToArrayBuffer(dataBinary);
        let mimeType = "application/octet-stream";
        if (dataType === 2) mimeType = "image/png";
        if (dataType === 3) mimeType = "audio/mpeg";

        extractedData = new Blob([buffer], { type: mimeType });
    }

    return { data: extractedData, dataSize, dataType };
}