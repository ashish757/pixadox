import {useMemo, useState} from "react";
import { bitsToMegabytes} from "../util/conversions.ts";
import {useLocation} from "react-router-dom";
import {imageDataToUrl} from "../util/loadImage.ts";
import {decodeImage} from "../util/decodeImage.ts";
import {type DecodedImageData} from "../util/decodeImage.ts";


const DecodePage = () => {
    const location = useLocation();

    console.log(location)

    const image = location.state?.image as ImageData | null;

    const [data, setData] = useState<DecodedImageData | null>(null);


    const imageUrl = useMemo(() => imageDataToUrl(image), [image]);

    const decodeHandler = () => {
        if(image == null) return;
        const data = decodeImage(image);
        setData(data);
    }



    return (
    <main className="flex-col min-h-screen items-center bg-background p-2">

        <div className="w-full flex space-x-2 px-8 py-4">
            <div className={"w-1/2"}>
                <h2 className={"text-center font-bold text-green-700 text-2xl"}>Original Image</h2>
                <div className={"flex justify-center items-center"}>
                    {
                        imageUrl ? <img className={""} src={imageUrl} alt={"testing"}/> : <p>Error Loading the Image</p>
                    }
                </div>
            </div>
            <div className="w-1/2">

                <button className="border border-gray-300 px-4 py-2 bg-green-500" onClick={decodeHandler}>Decode</button>

                <div>
                    Decoded Message:
                    <p>{data?.data}</p>
                </div>
            </div>

        </div>
        <div className="w-full flex space-x-2 px-8 py-4">

            <div className="w-1/2">
                <table className="w-full text-sm rtl:text-right text-body">
                    <tbody>

                    <tr className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-gray-300 border-default">
                        <td className="px-6 py-4">
                            Dimension
                        </td>
                        <td className="px-6 py-4">
                            {image?.height}px x {image?.width}px
                        </td>

                    </tr>
                    <tr className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default border-gray-300">
                        <td className="px-6 py-4">
                            Total Pixels
                        </td>
                        <td className="px-6 py-4">
                            {(image?.data.length || 0) / 4}
                        </td>
                    </tr>
                    <tr className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default border-gray-300">
                        <td className="px-6 py-4">
                            Total Colors
                        </td>
                        <td className="px-6 py-4">
                            {image?.data.length}
                        </td>
                    </tr>

                    <tr className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default border-gray-300">
                        <td className="px-6 py-4">
                            Available Space
                        </td>
                        <td className="px-6 py-4">
                            {bitsToMegabytes(image?.data.length || 0)}
                        </td>
                    </tr>


                    </tbody>
                </table>


            </div>


        </div>

    </main>
    )
}


export default DecodePage