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


export const imageDataToUrl = (imageData: ImageData | null): string  => {
    if(imageData == null) return "";

    const canvas = document.createElement('canvas');
    canvas.width = imageData.width;
    canvas.height = imageData.height;

    const ctx = canvas.getContext('2d');
    if(!ctx) throw new Error('Could not get canvas context');

    ctx.putImageData(imageData, 0, 0);

    return canvas.toDataURL('image/png');
}