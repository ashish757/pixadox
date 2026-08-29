// so basically this is to load the image into the canvas to get the raw pixel values of the image

export const getImageData = (imgUrl: string): Promise<ImageData> => {
    return new  Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.height = img.height;
            canvas.width = img.width;

            const ctx = canvas.getContext("2d");
            if(!ctx) {
                reject(new Error("Could not get canvas context"));
                return;
            }

            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            resolve(imageData);
        }

        img.onerror  = () => reject(new Error("Image failed to load"));
        img.src = imgUrl;
    })
}


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