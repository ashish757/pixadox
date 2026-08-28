const nearestOdd = (num: number): number => {
    return num % 2 === 0 ? num - 1 : num;
}


const nearestEven = (num: number): number => {
    return num % 2 === 0 ? num : num - 1;
}

export const encodeImageWithBinary = (imageData: ImageData, binary: string) => {
    const pixels = imageData.data;

    for(let i =0; i<binary.length; i++) {
        if(binary[i] === '1') {
            pixels[i] = nearestOdd(pixels[i]);
        } else {
            pixels[i] = nearestEven(pixels[i]);
        }
    }

    return imageData;

}


