import {getImageData} from "./loadImageData.ts";
import {useEffect, useMemo, useState} from "react";
import {bitsToMegabytes} from "./util/convertStorageUnit.ts";
import {stringToBinary} from "./util/stringToBinary.ts";
import {encodeImageWithBinary, imageDataToUrl} from "./util/encodeImage.ts";

export default function App() {
    const [originalImage, setOriginalImage] = useState<ImageData | null>(null);
    const [modifiedImage, setModifiedImage] = useState<ImageData | null>(null);
    const [message, setMessage] = useState<string>("");
    const [messageBinary, setMessageBinary] = useState<string>("");
    const imgUrl = "/test.png";


    useEffect(() => {
        const load = async () => {
            try {
                const data = await getImageData(imgUrl);
                setOriginalImage(data);
            } catch (e) {
                console.error("Error loading image data:", e)
            }

        }
        load()
    }, [imgUrl])



    const encodeHandler = () => {
        if(originalImage == null) return;
        const bin = stringToBinary(message);
        setMessageBinary(bin)
        const modified = encodeImageWithBinary(originalImage,bin);
        setModifiedImage(modified);
    }

    const originalImageUrl = useMemo(() => imageDataToUrl(originalImage), [originalImage]);
    const modifiedImageUrl = useMemo(() => imageDataToUrl(modifiedImage), [modifiedImage]);

    return (
        <main className="flex-col min-h-screen items-center bg-gray-100">
            <h1 className="text-4xl font-bold text-emerald-400">
                Welcome to Pixadox
            </h1>

            <div>
                <h2>Original Image</h2>
                <img width="400px" src={originalImageUrl} alt={"testing"} />
            </div>
            <div>
                <h2>Modified Image</h2>
                <img width="400px" src={modifiedImageUrl} alt={"not modified yet"} />
            </div>
            <div>
                <p>Height: {originalImage?.height}</p>
                <p>Width: {originalImage?.width}</p>
            </div>
            <div>
                <p>Pixels: {(originalImage?.data.length || 0) / 4}</p>
                <p>Colors: {originalImage?.data.length}</p>
            </div>
            <div>
                <p>Data Equivalence: {bitsToMegabytes(originalImage?.data.length || 0)}</p>
            </div>


            <div>
                <input onChange={(e) => setMessage(e.target.value)} type={"text"} placeholder={"Your message..."}/>
                <button onClick={encodeHandler}>Encode</button>
            </div>

            <div>
                <p>Message : {message}</p>
                <p>Binary : {messageBinary}</p>
            </div>
        </main>
    )
}