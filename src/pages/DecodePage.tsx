import { useEffect, useMemo, useState } from "react";
import { bitsToMegabytes } from "../util/conversions.ts";
import { useLocation, useNavigate } from "react-router-dom";
import { getAccentColor, imageDataToUrl } from "../util/loadImage.ts";
import { decodeImage, type DecodedImageData } from "../util/decodeImage.ts";
import { decryptPayload } from "../util/crypto.ts";
import { ArrowLeft, Home, Lock, Unlock, KeyRound, AlertTriangle, Download, File } from "lucide-react";

const DecodePage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const image = location.state?.image as ImageData | null;

    const [data, setData] = useState<DecodedImageData | null>(null);
    const [isDecoding, setIsDecoding] = useState<boolean>(true);

    const [isLocked, setIsLocked] = useState<boolean>(true);
    const [password, setPassword] = useState<string>("");
    const [decryptError, setDecryptError] = useState<string>("");

    const imageUrl = useMemo(() => imageDataToUrl(image), [image]);

    useEffect(() => {
        if (imageUrl == null) {
            navigate("/upload-decode", { replace: true });
            return;
        }

        const timer = setTimeout(() => {
            if (image) {
                const decoded = decodeImage(image);
                setData(decoded);
                if (decoded.isEncrypted) {
                    setIsLocked(true);
                }
                setIsDecoding(false);
            }
        }, 50);

        return () => clearTimeout(timer);
    }, [image, imageUrl, navigate]);

    const handleDecrypt = async () => {
        if (!data || !data.data || typeof data.data === 'string' || data.data instanceof Blob) return;

        setDecryptError("");
        try {
            const buffer = data.data as ArrayBuffer;

            const salt = new Uint8Array(buffer, 0, 16);
            const iv = new Uint8Array(buffer, 16, 12);
            const ciphertext = new Uint8Array(buffer, 28);

            const decryptedBuffer = await decryptPayload(password, salt, iv, ciphertext);

            let extractedData: string | Blob;
            if (data.dataType === 1) {
                extractedData = new TextDecoder().decode(decryptedBuffer);
            } else {
                let mimeType = "application/octet-stream";
                if (data.dataType === 2) mimeType = "image/png";
                if (data.dataType === 3) mimeType = "audio/mpeg";
                extractedData = new Blob([decryptedBuffer], { type: mimeType });
            }

            setData({ ...data, data: extractedData, isEncrypted: false });
            setIsLocked(false);
        } catch (err) {
            setDecryptError("Incorrect password or the payload has been corrupted.");
        }
    };

    useEffect(() => {
        if (image) {
            const { r, g, b } = getAccentColor(image);
            document.documentElement.style.setProperty('--image-accent', `${r} ${g} ${b}`);

            const luminance  = 0.299 * r + 0.587 * g + 0.114 * b;
            const foregroundRGB = luminance > 128 ? '0 0 0' : '255 255 255';
            document.documentElement.style.setProperty('--image-accent-foreground', foregroundRGB);

        } else {
            document.documentElement.style.setProperty('--image-accent', '34 197 94');
            document.documentElement.style.setProperty('--image-accent-foreground', '255 255 255');
        }

        return () => {
            document.documentElement.style.setProperty('--image-accent', '34 197 94');
            document.documentElement.style.setProperty('--image-accent-foreground', '255 255 255');
        };
    }, [image]);

    const renderDecodedData = () => {
        if (!data || data.dataSize === 0) {
            return (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <AlertTriangle size={48} className="text-red-500 mb-4 opacity-80" />
                    <h3 className="text-xl font-bold text-foreground mb-2">No Payload Detected</h3>
                    <p className="text-muted-foreground">We couldn't find a valid Pixadox payload in this image. It may be a standard image or the data was corrupted.</p>
                </div>
            );
        }

        if (isLocked) {
            return (
                <div className="flex flex-col items-center justify-center p-8 h-full text-center">
                    <div className="w-20 h-20 bg-image-accent/20 rounded-full flex items-center justify-center mb-6 text-image-accent shadow-inner">
                        <Lock size={40} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-foreground">Encrypted Payload</h3>
                    <p className="text-muted-foreground text-sm mb-8 max-w-sm">
                        This image contains a secure, AES-GCM encrypted payload. Enter the password to unlock the data.
                    </p>

                    <div className="w-full max-w-xs flex flex-col gap-4">
                        <div className="relative animate-in fade-in slide-in-from-top-2 duration-200">
                            <KeyRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleDecrypt()}
                                placeholder="Enter password"
                                className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-image-accent/50 bg-background"
                            />
                        </div>
                        <button
                            onClick={handleDecrypt}
                            disabled={!password}
                            className="bg-image-accent hover:bg-image-accent/90 text-image-accent-foreground font-bold py-3 rounded-xl disabled:opacity-50 transition-all shadow-sm flex justify-center items-center gap-2"
                        >
                            <Unlock size={18} /> Decrypt Data
                        </button>
                    </div>
                    {decryptError && (
                        <p className="text-red-500 text-sm font-bold mt-6 flex items-center gap-2 bg-red-500/10 px-4 py-2 rounded-lg">
                            <AlertTriangle size={16} /> {decryptError}
                        </p>
                    )}
                </div>
            );
        }

        if (data.dataType === 1 && typeof data.data === "string") {
            return (
                <div className="flex flex-col h-full">
                    <div className="flex-1 w-full bg-background border border-border rounded-xl p-5 overflow-auto max-h-[300px]">
                        <p className="whitespace-pre-wrap break-words text-foreground font-mono text-sm leading-relaxed">{data.data}</p>
                    </div>
                </div>
            );
        }

        if (data.data instanceof Blob) {
            const objectUrl = URL.createObjectURL(data.data);

            if (data.dataType === 2) {
                return (
                    <div className="flex flex-col items-center justify-center gap-6 h-full p-4">
                        <div className="bg-black/5 p-2 rounded-xl border border-border w-full flex justify-center">
                            <img src={objectUrl} alt="Extracted payload" className="max-h-56 object-contain rounded-lg shadow-sm" />
                        </div>
                        <a href={objectUrl} download="extracted_image.png" className="w-full sm:w-auto">
                            <button className="w-full bg-image-accent text-image-accent-foreground px-8 py-3 rounded-xl hover:bg-image-accent/90 transition-all shadow-sm font-bold flex items-center justify-center gap-2">
                                <Download size={18} /> Download Image
                            </button>
                        </a>
                    </div>
                );
            }

            if (data.dataType === 3) {
                return (
                    <div className="flex flex-col items-center justify-center gap-8 h-full w-full p-6">
                        <div className="w-full bg-background border border-border rounded-2xl p-6 shadow-sm flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-image-accent/10 rounded-full flex items-center justify-center text-image-accent mb-2">
                                <File size={32} />
                            </div>
                            <audio controls src={objectUrl} className="w-full custom-audio" />
                        </div>
                        <a href={objectUrl} download="extracted_audio.mp3" className="w-full sm:w-auto">
                            <button className="w-full bg-image-accent text-image-accent-foreground px-8 py-3 rounded-xl hover:bg-image-accent/90 transition-all shadow-sm font-bold flex items-center justify-center gap-2">
                                <Download size={18} /> Download Audio
                            </button>
                        </a>
                    </div>
                );
            }

            if (data.dataType === 4) {
                return (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                        <div className="w-24 h-24 bg-image-accent/10 rounded-full flex items-center justify-center text-image-accent mb-6">
                            <File size={48} />
                        </div>
                        <p className="mb-8 font-bold text-foreground text-lg">File payload successfully extracted.</p>
                        <a href={objectUrl} download="extracted_payload.bin">
                            <button className="bg-image-accent text-image-accent-foreground px-10 py-3.5 rounded-xl hover:bg-image-accent/90 transition-all shadow-md font-bold flex items-center justify-center gap-2">
                                <Download size={20} /> Download File
                            </button>
                        </a>
                    </div>
                );
            }
        }

        return (
            <div className="flex flex-col items-center justify-center h-full">
                <AlertTriangle size={32} className="text-red-500 mb-2" />
                <p className="text-red-500 font-bold">Unknown data format extracted.</p>
            </div>
        );
    };

    if (imageUrl == null) return null;

    return (
        <main className="flex flex-col min-h-screen items-center bg-background pb-12">

            <div className="w-full flex justify-between items-center px-8 py-6 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <button
                    onClick={() => navigate("/upload-decode")}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-mono text-sm uppercase tracking-wider transition-colors"
                >
                    <ArrowLeft size={16} /> Upload Different Image
                </button>

                <div className="flex gap-4">
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 border border-border px-5 py-2 rounded-full hover:bg-secondary font-bold text-sm transition-colors shadow-sm bg-card"
                    >
                        <Home size={16} /> Home
                    </button>
                    <button
                        onClick={() => navigate("/upload-encode")}
                        className="flex items-center gap-2 border border-border px-5 py-2 rounded-full hover:bg-secondary font-bold text-sm transition-colors shadow-sm bg-card"
                    >
                        <Lock size={16} /> Encode
                    </button>
                </div>
            </div>

            <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-6 px-8 py-8">

                <div className="w-full lg:w-1/2">
                    <div className="border border-image-accent/60 bg-card rounded-2xl overflow-hidden shadow-sm flex flex-col h-full">
                        <h2 className="bg-image-accent/50 text-image-accent-foreground border-b border-image-accent/50 font-bold text-lg px-5 py-3 flex items-center gap-2">
                            Uploaded Image
                        </h2>
                        <div className="flex-1 flex justify-center items-center p-4 bg-black/5 min-h-[300px]">
                            <img className="max-h-[400px] object-contain rounded-lg shadow-sm" src={imageUrl} alt="Uploaded for decoding" />
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-1/2">
                    <div className="border border-image-accent/60 bg-card rounded-2xl overflow-hidden shadow-sm flex flex-col h-full relative">
                        <h2 className="bg-image-accent/50 text-image-accent-foreground border-b border-image-accent/50 font-bold text-lg px-5 py-3 flex items-center gap-2">
                            {isLocked && !isDecoding ? <Lock size={18} /> : <Unlock size={18} />}
                            Decoded Payload
                        </h2>
                        <div className="flex-1 p-6 bg-card flex flex-col min-h-[300px]">
                            {isDecoding ? (
                                <div className="flex flex-col items-center justify-center h-full gap-4">
                                    <div className="w-10 h-10 border-4 border-image-accent/30 border-t-image-accent rounded-full animate-spin"></div>
                                    <p className="font-bold text-muted-foreground animate-pulse">Extracting secret data...</p>
                                </div>
                            ) : (
                                renderDecodedData()
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-6 px-8">
                <div className="w-full lg:w-1/2">
                    <div className="grid grid-cols-2 gap-4 border border-image-accent/50 rounded-2xl p-6 bg-image-accent/20 shadow-sm h-full content-start">
                        <div>
                            <p className="mb-1 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">Dimensions</p>
                            <p className="font-mono text-xl font-medium text-image-accent-foreground">{image?.height}px × {image?.width}px</p>
                        </div>
                        <div>
                            <p className="mb-1 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Pixels</p>
                            <p className="font-mono text-xl font-medium text-image-accent-foreground">{((image?.data.length || 0) / 4).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="mb-1 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">RGB Channels</p>
                            <p className="font-mono text-xl font-medium text-image-accent-foreground">{(((image?.data.length || 0) / 4) * 3).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="mb-1 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">Max Capacity</p>
                            <p className="font-mono text-xl font-bold text-image-accent-foreground">{bitsToMegabytes(((image?.data.length || 0) * 0.75) - 104)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default DecodePage;