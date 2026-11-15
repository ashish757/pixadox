// so basically this is to load the image into the canvas to get the raw pixel values of the image

export const getImageData = (imgUrl: string): Promise<ImageData | null> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
                resolve(null);
                return;
            }

            ctx.drawImage(img, 0, 0);
            resolve(ctx.getImageData(0, 0, img.width, img.height));
        };

        img.onerror = () => {
            resolve(null);
        };

        img.src = imgUrl;
    });
};


export const imageDataToUrl = (imageData: ImageData | null): string | null  => {
    if(imageData == null) return null;

    const canvas = document.createElement('canvas');
    canvas.width = imageData.width;
    canvas.height = imageData.height;

    const ctx = canvas.getContext('2d');
    if(!ctx) throw new Error('Could not get canvas context');

    ctx.putImageData(imageData, 0, 0);

    return canvas.toDataURL('image/png');
}

export const getAccentColor = (imageData: ImageData) => {
    const data=  imageData.data;
    let r=0, g=0, b=0;

    const step =40;
    let sampledPixels = 0;

    for(let i =0; i<data.length; i += step) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        sampledPixels++;
    }


    return {
        r: Math.floor(r / sampledPixels),
        g: Math.floor(g / sampledPixels),
        b: Math.floor(b / sampledPixels)
    };

}

export const getDiffImageData = (originalImage: ImageData, encodedImage: ImageData) => {
    const length = originalImage.data.length;
    const diffPixels = new Uint8ClampedArray(length);

    for (let i = 0; i < length; i += 4) {
        if (
            originalImage.data[i] !== encodedImage.data[i] ||
            originalImage.data[i + 1] !== encodedImage.data[i + 1] ||
            originalImage.data[i + 2] !== encodedImage.data[i + 2]
        ) {
            diffPixels[i] = 34;
            diffPixels[i + 1] = 197;
            diffPixels[i + 2] = 94;
            diffPixels[i + 3] = 255;
        } else {

            diffPixels[i] = 0;
            diffPixels[i+1] = 0;
            diffPixels[i+2] = 0;
            diffPixels[i+3] = 255;
        }
    }

    return new ImageData(diffPixels, originalImage.width, originalImage.height);
}