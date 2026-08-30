import { useEffect, useMemo, useState } from "react";
import { bitsToMegabytes } from "../util/conversions.ts";
import { useLocation, useNavigate } from "react-router-dom";
import { imageDataToUrl } from "../util/loadImage.ts";
import { decodeImage } from "../util/decodeImage.ts";
import { type DecodedImageData } from "../util/decodeImage.ts";
import { ArrowLeft, Home, Lock } from "lucide-react";

const DecodePage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const image = location.state?.image as ImageData | null;

    const [data, setData] = useState<DecodedImageData | null>(null);
    const [isDecoding, setIsDecoding] = useState<boolean>(true);

    const imageUrl = useMemo(() => imageDataToUrl(image), [image]);

    useEffect(() => {
        if (imageUrl == null) {
            navigate("/upload-decode", { replace: true });
            return;
        }

        // Defer the heavy computation to allow the initial UI to paint first
        const timer = setTimeout(() => {
            if (image) {
                const decoded = decodeImage(image);
                setData(decoded);
                setIsDecoding(false);
            }
        }, 50); // A 50ms delay is enough to guarantee the browser paints the spinner

        // Cleanup timer if component unmounts early
        return () => clearTimeout(timer);
    }, [image, imageUrl, navigate]);

    // Dynamic rendering function to handle different data types safely
    const renderDecodedData = () => {
        if (!data || data.dataSize === 0) {
            return <p className="text-red-500 font-bold mt-2">No valid Pixadox payload found in this image.</p>;
        }

        // 1: Text
        if (data.dataType === 1 && typeof data.data === "string") {
            return (
                <p className="whitespace-pre-wrap break-words text-gray-700 mt-2">
                    {data.data}
                </p>
            );
        }

        // Handle Binary Blobs
        if (data.data instanceof Blob) {
            const objectUrl = URL.createObjectURL(data.data);

            // 2: Image
            if (data.dataType === 2) {
                return (
                    <div className="flex flex-col gap-4 mt-4">
                        <img src={objectUrl} alt="Extracted payload" className="max-h-64 object-contain rounded-md border border-gray-300" />
                        <a href={objectUrl} download="extracted_image.png" className="self-start">
                            <button className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors">
                                Download Image
                            </button>
                        </a>
                    </div>
                );
            }

            // 3: Audio
            if (data.dataType === 3) {
                return (
                    <div className="flex flex-col gap-4 w-full mt-4">
                        <audio controls src={objectUrl} className="w-full" />
                        <a href={objectUrl} download="extracted_audio.mp3" className="self-start">
                            <button className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors">
                                Download Audio
                            </button>
                        </a>
                    </div>
                );
            }

            // 4: Generic File
            if (data.dataType === 4) {
                return (
                    <div className="flex flex-col items-center justify-center p-8 mt-4 bg-gray-100 border-2 border-dashed border-gray-300 rounded-md">
                        <p className="mb-4 font-bold text-gray-700">File payload successfully extracted.</p>
                        <a href={objectUrl} download="extracted_payload.bin">
                            <button className="bg-green-500 text-white px-8 py-3 rounded-md hover:bg-green-600 transition-colors font-bold">
                                Download File
                            </button>
                        </a>
                    </div>
                );
            }
        }

        return <p className="text-red-500 font-bold mt-2">Unknown data format extracted.</p>;
    };

    if (imageUrl == null) return null;

    return (
        <main className="flex-col min-h-screen items-center bg-background p-2">

            <div className="w-full flex justify-between items-center px-8 py-4">
                <button
                    onClick={() => navigate("/upload-decode")}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-mono text-sm uppercase tracking-wider transition-colors"
                >
                    <ArrowLeft size={16} /> Upload Different Image
                </button>

                <div className="flex gap-4">
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 border border-border px-5 py-2 rounded-full hover:bg-secondary font-bold text-sm transition-colors shadow-sm"
                    >
                        <Home size={16} /> Home
                    </button>
                    <button
                        onClick={() => navigate("/upload-encode")}
                        className="flex items-center gap-2 border border-border px-5 py-2 rounded-full hover:bg-secondary font-bold text-sm transition-colors shadow-sm"
                    >
                        <Lock size={16} /> Encode
                    </button>
                </div>
            </div>

            <div className="w-full flex space-x-2 px-8 py-4">
                <div className={"w-1/2"}>
                    <div className={"border-2 border-primary rounded-2xl overflow-hidden "}>
                        <h2 className={"bg-secondary-foreground font-bold text-green-300 text-2xl pl-4 py-2"}>Uploaded Image</h2>
                        <div className={"flex justify-center items-center"}>
                            <img className={""} src={imageUrl} alt={"testing"}/>
                        </div>
                    </div>
                </div>
                <div className="w-1/2 flex items-center justify-center border-2 border-gray-300 rounded-2xl p-4">
                    {isDecoding ? (
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="font-bold text-gray-700">Extracting secret data...</p>
                        </div>
                    ) : (
                        <div className="w-full h-full">
                            <h3 className="font-bold text-lg border-b border-gray-200 pb-2">Decoded Payload:</h3>
                            {renderDecodedData()}
                        </div>
                    )}
                </div>
            </div>

            <div className="w-full flex space-x-2 px-8 py-4">
                <div className="w-1/2">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4 border border-green-700 rounded-2xl p-4 bg-secondary">
                        <div className="pl-4 sm:pl-5">
                            <p className="mb-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                                Resolution
                            </p>
                            <p className="font-mono text-lg text-secondary-foreground">
                                {image?.height}x{image?.width}
                            </p>
                        </div>

                        <div className="border-l border-zinc-700/50 pl-4 sm:pl-5">
                            <p className="mb-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                                Total Pixels
                            </p>
                            <p className="font-mono text-lg text-secondary-foreground">
                                {(image?.data.length || 0) / 4}
                            </p>
                        </div>

                        <div className="border-l border-zinc-700/50 pl-4 sm:pl-5">
                            <p className="mb-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                                Total Colors
                            </p>
                            <p className="font-mono text-lg text-secondary-foreground">
                                {image?.data.length}
                            </p>
                        </div>

                        <div className="border-l border-zinc-700/50 pl-4 sm:pl-5">
                            <p className="mb-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                                Total Space
                            </p>
                            <p className="font-mono text-lg text-secondary-foreground">
                                {bitsToMegabytes((image?.data.length || 0) * 0.75)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default DecodePage;