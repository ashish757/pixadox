import {useMemo, useState, useEffect} from "react";
import {encodeImage} from "../util/encodeImage.ts";
import {imageDataToUrl} from "../util/loadImage.ts";
import {stringToBinary, bitsToMegabytes} from "../util/conversions.ts";
import {useLocation, useNavigate} from "react-router-dom";



const EncodePage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    console.log(location)

    const originalImage = location.state?.originalImage as ImageData | null;


    const [modifiedImage, setModifiedImage] = useState<ImageData | null>(null);
    const [message, setMessage] = useState<string>("");


    const originalImageUrl = useMemo(() => imageDataToUrl(originalImage), [originalImage]);
    const modifiedImageUrl = useMemo(() => imageDataToUrl(modifiedImage), [modifiedImage]);



    useEffect(() => {
        if (originalImageUrl == null) {
            navigate("/upload-encode", { replace: true });
        }
    }, [originalImageUrl, navigate]);

    const encodeHandler = () => {
        if(originalImage == null) return;
        const bin = stringToBinary(message);
        const modified = encodeImage(originalImage, bin);
        setModifiedImage(modified);
    }

    if(originalImageUrl == null) return;

    return (
    <main className="flex-col min-h-screen items-center bg-background p-2">

        <div className="w-full flex space-x-2 px-8 py-4">
            <div className={"w-1/2"}>
                <div className={"border-2 border-primary rounded-2xl overflow-hidden "}>
                    <h2 className={"bg-primary font-bold text-green-300 text-2xl pl-4 py-2"}>Original Image</h2>
                    <div className={"flex justify-center items-center"}>
                        <img className={""} src={originalImageUrl} alt={"testing"}/>
                    </div>
                </div>
            </div>
            <div className={"w-1/2"}>
                <div className={"border-2 border-red rounded-2xl overflow-hidden h-full relative"}>
                    <h2 className={"font-bold text-orange-400 text-2xl pl-4 py-2 bg-primary"}>Encoded Image</h2>
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
                    <div className={"absolute p-4 flex gap-4 bottom-1 right-1"}>
                        {modifiedImageUrl && <a href={modifiedImageUrl} download={"encoded.png"}>
                            <button className={"border rounded-md border-gray-300 bg-gray-200 px-8 py-2 cursor-pointer text-gray-700"}>Download</button>
                        </a>}
                    </div>
                </div>

            </div>

        </div>
        <div className="w-full flex space-x-2 px-8 py-4">

            <div className="w-1/2">

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4 border border-green-700 rounded-2xl p-4 bg-secondary">

                    <div className="pl-4 sm:pl-5">
                        <p className="mb-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                            Dimensions
                        </p>
                        <p className="font-mono text-lg text-secondary-foreground">
                            {originalImage?.height}px x {originalImage?.width}px
                        </p>
                    </div>

                    <div className="border-l border-zinc-700/50 pl-4 sm:pl-5">
                        <p className="mb-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                            Total Pixels
                        </p>
                        <p className="font-mono text-lg text-secondary-foreground">
                            {(originalImage?.data.length || 0) / 4}
                        </p>
                    </div>
                    <div className="border-l border-zinc-700/50 pl-4 sm:pl-5">
                        <p className="mb-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                            Total Colors
                        </p>
                        <p className="font-mono text-lg text-secondary-foreground">
                            {originalImage?.data.length}
                        </p>
                    </div>

                    <div className="border-l border-zinc-700/50 pl-4 sm:pl-5">
                        <p className="mb-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                            Total Space
                        </p>
                        <p className="font-mono text-lg text-secondary-foreground">
                            {bitsToMegabytes(originalImage?.data.length || 0)}
                        </p>
                    </div>
                </div>

            </div>
            <div className="w-1/2">

                <div className={"flex-col border-2 border-black rounded-2xl overflow-hidden "}>
                    <h2 className={"px-2 py-2 bg-primary text-gray-200"}>Enter The Data you want to hide inside the image</h2>
                    <div className={"px-6 pt-4"}>
                        <textarea className={"w-full border p-4 rounded-md bg-secondary border-gray-300 focus:outline-1 "} rows={8} onChange={(e) => setMessage(e.target.value)}  placeholder={"Your message..."}/>

                    </div>
                    <div className={"p-4 flex gap-4"}>
                        <button className={"border rounded-md border-gray-300 bg-gray-200 px-8 py-2 cursor-pointer text-gray-700"} onClick={encodeHandler}>Encode</button>
                    </div>
                </div>


            </div>

        </div>

    </main>
    )
}


export default EncodePage