import {binaryToString} from "./conversions.ts";

export interface DecodedImageData {
    data: string,
    dataSize: number,
    dataType: number
}

export const decodeImage = (imageData: ImageData): DecodedImageData => {



    const pixels = imageData.data;

    let markerBinary = "";
    for(let i = 0; i<56; i++) {
        if(i >= pixels.length) break;
        markerBinary += pixels[i];
    }

    if(binaryToString(markerBinary) !== "%PI#XL%") {
        return {
            data: "",
            dataSize: 0,
            dataType: 0
        }
    }

    let dataBinary = "";
    let dataSizeBinary = "";
    let dataTypeBinary = "";

    for(let i =0; i<32; i++) {
        dataSizeBinary += pixels[i] % 2;
    }

    for(let i = 32; i<40; i++) {
        dataTypeBinary += pixels[i] % 2;
    }

    const dataSize = parseInt(dataSizeBinary, 2);
    const dataType = parseInt(dataTypeBinary, 2);


    console.log(`dataSizeBinary: ${dataSizeBinary}, dataTypeBinary: ${dataTypeBinary}`);
    console.log(`Data Size: ${dataSize}, Data Type: ${dataType}`);

    for (let i = 40; i < dataSize + 40; i++) {
        if(i >= pixels.length) break;
        dataBinary += imageData.data[i] % 2;
    }

    const data = binaryToString(dataBinary);

    return {
        data, dataSize, dataType
    };
}



