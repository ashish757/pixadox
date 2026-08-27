import {getImageData} from "./loadImageData.ts";
import {useEffect, useState} from "react";
import {bitsToMegabytes} from "./util/convertStorageUnit.ts";
import {stringToBinary} from "./util/stringToBinary.ts";
import {binaryToString} from "./util/binaryToString.ts";

export default function App() {
    const [imgStats, setImgStats] = useState<{width: number, height: number, pixelCount: number, totalValues : number} | null>(null);
    const imgUrl = "/test.png";


    useEffect(() => {
        const load = async () => {
            try {
                const data = await getImageData(imgUrl);
                setImgStats({
                    width: data.width,
                    height: data.height,
                    totalValues: data.data.length,
                    pixelCount: data.data.length / 4,

                })
            } catch (e) {
                console.error("Error loading image data:", e)
            }

        }


        load()



    }, [imgUrl])


    useEffect(() => {
        const bin = stringToBinary("PIXADOX");
        const text = binaryToString(bin);
        console.log(text);

    }, []);

    return (
        <div className="flex-col min-h-screen items-center bg-gray-100">
            <h1 className="text-4xl font-bold text-emerald-400">
                Welcome to Pixadox
            </h1>

            <div>
                <img width="400px" src={imgUrl} alt={"testing"} />
            </div>
            <div>
                <p>Height: {imgStats?.height}</p>
                <p>Width: {imgStats?.width}</p>
            </div>
            <div>
                <p>Total: {imgStats?.totalValues}</p>
                <p>Pixels: {imgStats?.pixelCount}</p>
            </div>
            <div>
                <p>Data Equivalnce: {bitsToMegabytes(imgStats?.totalValues || 0)}</p>
            </div>
        </div>
    )
}