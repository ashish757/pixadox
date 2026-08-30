import UploadImage from "../components/UploadImage.tsx";
import { getImageData } from "../util/loadImage.ts";
import { type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Info, Shield, Cpu } from "lucide-react";

const UploadEncodePage = () => {
    const navigate = useNavigate();

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const imgUrl = URL.createObjectURL(file);
        const data = await getImageData(imgUrl);

        if (data) navigate("/encode", { state: { originalImage: data } });
    }

    return (
        <main className="flex flex-col min-h-screen items-center bg-background p-6 sm:p-12">

            <div className="w-full max-w-5xl flex justify-between items-center mb-12 px-4">
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-mono text-sm uppercase tracking-wider transition-colors"
                >
                    <ArrowLeft size={16} /> Back to Home
                </button>
                <button
                    onClick={() => navigate("/upload-decode")}
                    className="flex items-center gap-2 border border-border px-5 py-2 rounded-full hover:bg-secondary font-bold text-sm transition-colors shadow-sm"
                >
                    Switch to Decode <ArrowRight size={16} />
                </button>
            </div>

            <div className="flex flex-col items-center gap-3 mb-10 px-4 text-center">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Encode Data</h1>
                <p className="text-lg text-muted-foreground max-w-xl">
                    Images are never uploaded to a server. All processing is strictly done on your device.
                </p>
            </div>

            <div className="w-full max-w-3xl">
                <UploadImage handleFileChange={handleFileChange} />
            </div>

            <div className="w-full max-w-3xl mt-16 p-8 rounded-2xl border border-border bg-card shadow-sm">
                <h2 className="text-xl font-bold flex items-center gap-2 mb-6 border-b border-border pb-4">
                    <Info size={22} className="text-primary" /> How does encoding work?
                </h2>

                <div className="grid gap-8 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-wider text-primary">
                            <Cpu size={18} /> Least Significant Bit
                        </div>
                        <p className="text-sm leading-6 text-muted-foreground">
                            Pixadox uses LSB steganography. It takes your secret data, converts it into raw binary (1s and 0s), and hides it by slightly altering the lowest value bits of the Red, Green, and Blue pixels in your image. The change is invisible to the human eye.
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-wider text-primary">
                            <Shield size={18} /> Complete Privacy
                        </div>
                        <p className="text-sm leading-6 text-muted-foreground">
                            To ensure total privacy and prevent browser-induced data corruption, Pixadox runs entirely in your local memory. We skip the Alpha (transparency) channel during encoding, leaving you with exactly 75% of the image's raw pixel capacity for secure storage.
                        </p>
                    </div>
                </div>
            </div>

        </main>
    )
}

export default UploadEncodePage;