import { useEffect, useMemo, useState } from "react";
import { encodeImage } from "../util/encodeImage.ts";
import { imageDataToUrl, getAccentColor, getDiffImageData } from "../util/loadImage.ts";
import { stringToBinary, bitsToMegabytes, arrayBufferToBinary } from "../util/conversions.ts";
import { encryptPayload } from "../util/crypto.ts";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Home, Lock, Unlock, Key, Loader2, Check } from "lucide-react";


type DataType = "text" | "image" | "audio" | "file";

const EncodePage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const originalImage = location.state?.originalImage as ImageData | null;

    const [modifiedImage, setModifiedImage] = useState<ImageData | null>(null);

    const [dataType, setDataType] = useState<DataType>("text");
    const [message, setMessage] = useState<string>("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState<string>("");

    const [isEncrypting, setIsEncrypting] = useState<boolean>(false);
    const [password, setPassword] = useState("");

    const [diffImageUrl, setDiffImageUrl] = useState<string | null>(null);
    const [showDiff, setShowDiff] = useState<boolean>(false);

    const [embedStatus, setEmbedStatus] = useState<"idle" | "processing" | "success">("idle");

    const originalImageUrl = useMemo(() => imageDataToUrl(originalImage), [originalImage]);
    const modifiedImageUrl = useMemo(() => imageDataToUrl(modifiedImage), [modifiedImage]);

    const availableBytes = useMemo(() => {
        if (!originalImage) return 0;
        const headerBits = 104;
        const encryptionOverhead = isEncrypting ? (44 * 8) : 0;
        return Math.floor(((originalImage.data.length * 0.75) - headerBits - encryptionOverhead) / 8);
    }, [originalImage, isEncrypting]);

    const currentPayloadBytes = useMemo(() => {
        if (dataType === 'text') {
            return new Blob([message]).size;
        }
        return selectedFile ? selectedFile.size : 0;
    }, [dataType, message, selectedFile]);

    const usagePercentage = useMemo(() => {
        if (availableBytes === 0) return 0;
        const percent = Math.floor((currentPayloadBytes / availableBytes) * 100);
        return Math.min(percent, 100);
    }, [currentPayloadBytes, availableBytes]);

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    useEffect(() => {
        if (!originalImage) {
            navigate("/upload-encode", { replace: true });
        }
    }, [originalImage, navigate]);

    useEffect(() => {
        if (originalImage) {
            const { r, g, b } = getAccentColor(originalImage);
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
    }, [originalImage]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > availableBytes) {
            const fileMB = (file.size / 1024 / 1024).toFixed(2);
            const limitMB = (availableBytes / 1024 / 1024).toFixed(2);
            setFileError(`File is too large (${fileMB} MB). Maximum allowed is ${limitMB} MB.`);
            setSelectedFile(null);
        } else {
            setFileError("");
            setSelectedFile(file);
        }
    };

    const encodeHandler = async () => {
        if (!originalImage) return;
        setFileError("");

        if (currentPayloadBytes > availableBytes) {
            setFileError("Payload exceeds available capacity.");
            return;
        }

        setEmbedStatus("processing");
        await new Promise((resolve) => setTimeout(resolve, 50));

        try {
            let finalBinary;

            if (isEncrypting) {
                if (!password) {
                    setFileError("A password is required for encryption.");
                    setEmbedStatus("idle");
                    return;
                }

                let buffer: ArrayBuffer;
                if(dataType === "text") {
                    if(!message) {
                        setEmbedStatus("idle");
                        return;
                    }
                    buffer = new TextEncoder().encode(message).buffer;
                } else {
                    if(!selectedFile) {
                        setEmbedStatus("idle");
                        return;
                    }
                    buffer = await selectedFile.arrayBuffer();
                }

                const { salt, iv, ciphertext } = await encryptPayload(password, buffer);
                const combined = new Uint8Array(16 + 12 + ciphertext.length);
                combined.set(salt, 0);
                combined.set(iv, 16);
                combined.set(ciphertext, 28);

                finalBinary = arrayBufferToBinary(combined.buffer);
            } else {
                if (dataType === "text") {
                    if (!message) {
                        setEmbedStatus("idle");
                        return;
                    }
                    finalBinary = stringToBinary(message);
                } else {
                    if (!selectedFile) {
                        setEmbedStatus("idle");
                        return;
                    }
                    const buffer = await selectedFile.arrayBuffer();
                    finalBinary = arrayBufferToBinary(buffer);
                }
            }

            const modified = encodeImage(originalImage, finalBinary, dataType, isEncrypting);
            setModifiedImage(modified);

            const diffData = getDiffImageData(originalImage, modified);
            setDiffImageUrl(imageDataToUrl(diffData));
            setShowDiff(false);
            setEmbedStatus("success");
            setTimeout(() => {
                setEmbedStatus("idle");
            }, 3000);

        } catch (error) {
            setFileError("An error occurred during encoding.");
            setEmbedStatus("idle");
        }
    }

    const handleDownloadAndTest = () => {
        if (!modifiedImageUrl) return;

        const link = document.createElement('a');
        link.href = modifiedImageUrl;
        link.download = "encoded_payload.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
            navigate("/upload-decode");
        }, 500);
    }

    if (!originalImage || originalImageUrl === null) return null;

    return (
        <main className="flex flex-col min-h-screen items-center bg-background pb-8">

            <div className="w-full flex justify-between items-center px-8 py-4 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <button
                    onClick={() => navigate("/upload-encode")}
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
                        onClick={() => navigate("/upload-decode")}
                        className="flex items-center gap-2 border border-border px-5 py-2 rounded-full hover:bg-secondary font-bold text-sm transition-colors shadow-sm bg-card"
                    >
                        <Unlock size={16} /> Decode
                    </button>
                </div>
            </div>

            <div className="w-full flex flex-col lg:flex-row gap-6 px-8 py-8">

                <div className="w-full lg:w-1/2 flex flex-col gap-6">

                    <div className="border border-image-accent/60 bg-card rounded-2xl overflow-hidden shadow-sm flex flex-col">
                        <div className="bg-image-accent/50 text-image-accent-foreground border-b border-image-accent/50 font-bold text-lg px-5 py-2 flex items-center gap-2">
                            Original Image
                        </div>
                        <div className="flex-1 flex justify-center items-center p-2 bg-black/5">
                            <img className="max-h-75 object-contain rounded-lg shadow-sm" src={originalImageUrl} alt="Original" />
                        </div>
                    </div>

                    <div className="border border-image-accent/60 bg-card rounded-2xl overflow-hidden shadow-sm flex flex-col">
                        <div className="bg-image-accent/50 text-image-accent-foreground border-b border-image-accent/50  px-5 py-2 flex items-center justify-between">
                            <span className=" font-bold text-lg">Encoded Image</span>
                            {modifiedImageUrl && (
                                <div className=" flex gap-1">
                                    {diffImageUrl && (
                                        <button
                                            onClick={() => setShowDiff(!showDiff)}
                                            className="text-sm backdrop-blur-sm px-4 py-1.5 rounded-xl cursor-pointer text-image-accent-foreground  bg-image-accent  transition-all"
                                        >
                                            {showDiff ? "View Image" : "View Noise"}
                                        </button>
                                    )}
                                    <button
                                        onClick={handleDownloadAndTest}
                                        className="text-sm backdrop-blur-sm px-4 py-1.5 rounded-xl cursor-pointer text-image-accent-foreground bg-image-accent  transition-all"
                                    >
                                        Download
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 flex justify-center items-center p-2 bg-black/5 min-h-75">
                            {modifiedImageUrl ? (
                                <img
                                    className="max-h-75 object-contain rounded-lg shadow-sm pixel-art"
                                    src={(showDiff ? diffImageUrl : modifiedImageUrl) || undefined}
                                    alt={showDiff ? "Forensic Noise Map" : "Encoded Image"}
                                />
                            ) : (
                                <div className="text-center px-8">
                                    <div className="w-16 h-16 mx-auto bg-image-accent/50 rounded-full flex items-center justify-center mb-4">
                                        <Lock size={24} className="text-image-accent/50" />
                                    </div>
                                    <p className="font-medium text-muted-foreground text-balance">
                                        Encode a payload below to preview the modified image
                                    </p>
                                </div>
                            )}
                        </div>

                    </div>

                </div>

                <div className="w-full lg:w-1/2 flex flex-col gap-6">

                    <div className="space-y-2 divide-y py-4 border-black  bg-image-accent/10  font-mono text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        <div className="flex justify-between pb-1 px-6">
                            <p>Dimensions</p>
                            <p className="text-image-accent-foreground text-shadow-md text-shadow-gray-400">{originalImage.height}px × {originalImage.width}px</p>
                        </div>
                        <div className="flex justify-between pb-1 px-6">
                            <p>Total Pixels</p>
                            <p className="text-image-accent-foreground text-shadow-md text-shadow-gray-400">{(originalImage.data.length / 4).toLocaleString()}</p>
                        </div>
                        <div className="flex justify-between pb-1 px-6">
                            <p>RGB Channels</p>
                            <p className="text-image-accent-foreground text-shadow-md text-shadow-gray-400">{((originalImage.data.length / 4) * 3).toLocaleString()}</p>
                        </div>
                        <div className="flex justify-between pb-1 px-6">
                            <p>Safe Capacity</p>
                            <p className="text-image-accent-foreground text-shadow-md text-shadow-gray-400">{bitsToMegabytes(availableBytes * 8)}</p>
                        </div>
                    </div>

                    <div className="flex flex-col border border-border rounded-2xl overflow-hidden bg-card shadow-sm">
                        <div className="flex bg-image-accent/70 text-image-accent-foreground">
                            {(['text', 'image', 'audio', 'file'] as DataType[]).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => {
                                        setDataType(type);
                                        setFileError("");
                                    }}
                                    className={`flex-1 py-3.5 font-mono text-sm uppercase font-bold transition-colors border-b-2 ${
                                        dataType === type
                                            ? 'bg-card text-image-accent-foreground border-image-accent'
                                            : 'text-muted border-transparent hover:text-image-accent-foreground hover:bg-card/50'
                                    }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>

                        <div className="p-6">
                            {dataType === 'text' ? (
                                <textarea
                                    className="w-full border border-border p-4 rounded-xl bg-image-accent/20 focus:outline-none focus:ring-2 focus:ring-image-accent/50 resize-none"
                                    rows={5}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Enter your secret message here..."
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-border rounded-xl bg-image-accent/20 hover:bg-image-accent/10 hover:border-image-accent/50 transition-colors relative group">
                                    <input
                                        type="file"
                                        accept={
                                            dataType === 'image' ? 'image/*' :
                                                dataType === 'audio' ? 'audio/*' :
                                                    '*/*'
                                        }
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="text-muted group-hover:text-image-accent transition-colors mb-2">
                                        <Lock size={32} />
                                    </div>
                                    <p className="text-foreground font-bold">Click or drag {dataType} to upload</p>
                                    <p className="text-sm text-muted-foreground mt-1">Max capacity: {(availableBytes / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            )}

                            <div className="mt-5">
                                <div className="flex justify-between text-xs font-mono font-bold text-muted-foreground mb-1.5 px-1">
                                    <span>Payload Usage: {usagePercentage}%</span>
                                    <span className={currentPayloadBytes > availableBytes ? "text-red-500" : ""}>
                                        {formatBytes(currentPayloadBytes)} / {formatBytes(availableBytes)}
                                    </span>
                                </div>
                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden border border-border">
                                    <div
                                        className={`h-full transition-all duration-300 ${usagePercentage > 100 ? 'bg-red-500' : 'bg-image-accent'}`}
                                        style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                                    />
                                </div>
                            </div>

                            <div className="mt-5 p-5 border border-border rounded-xl bg-secondary/30">
                                <label className="flex items-center gap-3 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 accent-image-accent cursor-pointer rounded"
                                        checked={isEncrypting}
                                        onChange={(e) => {
                                            setIsEncrypting(e.target.checked);
                                            setFileError("");
                                        }}
                                    />
                                    <span className="font-bold text-sm flex items-center gap-2 text-foreground">
                                        <Lock size={16} className={isEncrypting ? "text-image-accent" : "text-muted-foreground"} />
                                        Encrypt Payload (AES-GCM)
                                    </span>
                                </label>

                                {isEncrypting && (
                                    <div className="mt-4 relative animate-in fade-in slide-in-from-top-2 duration-200">
                                        <Key size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter a secure decryption password"
                                            className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-image-accent/50"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="h-6 mt-3">
                                {fileError && <p className="text-red-500 text-sm font-semibold flex items-center gap-1">⚠️ {fileError}</p>}
                                {selectedFile && !fileError && dataType !== 'text' && (
                                    <p className="text-green-600 dark:text-green-400 text-sm font-semibold flex items-center gap-1">✓ Ready: {selectedFile.name}</p>
                                )}
                            </div>
                        </div>

                        <div className="p-6 pt-0 mt-auto">
                            <button
                                className="w-full bg-image-accent/80 hover:bg-image-accent/90 text-image-accent-foreground border border-black px-8 py-3.5 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex justify-center items-center gap-2"
                                onClick={encodeHandler}
                                disabled={
                                    (dataType !== 'text' && !selectedFile) ||
                                    (dataType === 'text' && !message) ||
                                    (isEncrypting && !password) ||
                                    (currentPayloadBytes > availableBytes) ||
                                    embedStatus === "processing"
                                }
                            >
                                {embedStatus === "processing" ? (
                                    <><Loader2 size={18} className="animate-spin" /> Processing Data</>
                                ) : embedStatus === "success" ? (
                                    <><Check size={18} /> Successfully Embedded</>
                                ) : isEncrypting ? (
                                    <><Lock size={18} /> Encrypt & Embed {dataType}</>
                                ) : (
                                    <><Unlock size={18} /> Embed {dataType}</>
                                )}
                            </button>
                        </div>
                    </div>

                </div>

            </div>

        </main>
    )
}

export default EncodePage