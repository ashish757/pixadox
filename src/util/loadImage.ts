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