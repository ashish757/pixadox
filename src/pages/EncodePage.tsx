import {useMemo, useState} from "react";
import {encodeImageWithBinary, imageDataToUrl} from "../util/encodeImage.ts";
import {stringToBinary} from "../util/stringToBinary.ts";
import {bitsToMegabytes} from "../util/convertStorageUnit.ts";
import {useLocation} from "react-router-dom";



const EncodePage = () => {
    const location = useLocation();

    console.log(location)

    const originalImage = location.state?.originalImage as ImageData | null;

    const [modifiedImage, setModifiedImage] = useState<ImageData | null>(null);
    const [message, setMessage] = useState<string>("");


    const originalImageUrl = useMemo(() => imageDataToUrl(originalImage), [originalImage]);
    const modifiedImageUrl = useMemo(() => imageDataToUrl(modifiedImage), [modifiedImage]);

    const encodeHandler = () => {
        if(originalImage == null) return;
        const bin = stringToBinary(message);
        const modified = encodeImageWithBinary(originalImage,bin);
        setModifiedImage(modified);
    }



    return (
    <main className="flex-col min-h-screen items-center bg-gray-100 p-2">

        <div className="w-full flex space-x-2 px-8 py-4">
            <div className={"w-1/2"}>
                <h2 className={"text-center font-bold text-green-700 text-2xl"}>Original Image</h2>
                <div className={"flex justify-center items-center"}>
                    {
                        originalImageUrl ? <img className={""} src={originalImageUrl} alt={"testing"}/> : <p>Error Loading the Image</p>
                    }
                </div>
            </div>
            <div className={"w-1/2"}>
                <h2 className={"text-center font-bold text-orange-700 text-2xl"}>Encoded Image</h2>
                <div className={"flex justify-center items-center"}>
                {

                    modifiedImageUrl ? ( <>
                            <img src={modifiedImageUrl} alt={"not modified yet"} />
                    </>
                    ) : (
                        <p className={"mt-32"}>Have not Encoded any Message Yet</p>
                    )
                }
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
                            {originalImage?.height}px x {originalImage?.width}px
                        </td>

                    </tr>
                    <tr className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default border-gray-300">
                        <td className="px-6 py-4">
                            Total Pixels
                        </td>
                        <td className="px-6 py-4">
                            {(originalImage?.data.length || 0) / 4}
                        </td>
                    </tr>
                    <tr className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default border-gray-300">
                        <td className="px-6 py-4">
                            Total Colors
                        </td>
                        <td className="px-6 py-4">
                            {originalImage?.data.length}
                        </td>
                    </tr>

                    <tr className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default border-gray-300">
                        <td className="px-6 py-4">
                            Available Space
                        </td>
                        <td className="px-6 py-4">
                            {bitsToMegabytes(originalImage?.data.length || 0)}
                        </td>
                    </tr>


                    </tbody>
                </table>


            </div>
            <div className="w-1/2">
                <div>
                    <textarea className={"w-full border p-4 rounded-md border-gray-300 focus:outline-1 "} rows={10} onChange={(e) => setMessage(e.target.value)}  placeholder={"Your message..."}/>
                </div>

                <div className={" flex gap-4"}>
                    <button className={"border rounded-md border-gray-300 bg-gray-200 px-8 py-2 cursor-pointer text-gray-700"} onClick={encodeHandler}>Encode</button>
                    {modifiedImageUrl && <a href={modifiedImageUrl} download={"encoded.png"}>
                        <button className={"border rounded-md border-gray-300 bg-gray-200 px-8 py-2 cursor-pointer text-gray-700"}>Download</button>
                    </a>}
                </div>
            </div>

        </div>

    </main>
    )
}


export default EncodePage