import { useEffect, useMemo, useState } from "react";
import { encodeImage } from "../util/encodeImage.ts";
import { imageDataToUrl } from "../util/loadImage.ts";
import { stringToBinary, bitsToMegabytes, arrayBufferToBinary } from "../util/conversions.ts";
import { encryptPayload } from "../util/crypto.ts";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Home, Lock, Unlock, Key } from "lucide-react";

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

    const originalImageUrl = useMemo(() => imageDataToUrl(originalImage), [originalImage]);
    const modifiedImageUrl = useMemo(() => imageDataToUrl(modifiedImage), [modifiedImage]);

    const availableBytes = useMemo(() => {
        if (!originalImage) return 0;
        const headerBits = 104;
        const encryptionOverhead = isEncrypting ? (44 * 8) : 0;
        return Math.floor(((originalImage.data.length * 0.75) - headerBits - encryptionOverhead) / 8);
    }, [originalImage, isEncrypting]);

    useEffect(() => {
        if (!originalImage) {
            navigate("/upload-encode", { replace: true });
        }
    }, [originalImage, navigate]);

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

        let finalBinary;

        if (isEncrypting) {
            if (!password) {
                setFileError("A password is required for encryption.");
                return;
            }


            let buffer: ArrayBuffer;
            if(dataType === "text") {
                if(!message) return;
                buffer = new TextEncoder().encode(message).buffer;
            } else {
                if(!selectedFile) return;
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
                if (!message) return;
                finalBinary = stringToBinary(message);
            } else {
                if (!selectedFile) return;
                const buffer = await selectedFile.arrayBuffer();
                finalBinary = arrayBufferToBinary(buffer);
            }
        }

        const modified = encodeImage(originalImage, finalBinary, dataType, isEncrypting);
        setModifiedImage(modified);
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
        <main className="flex-col min-h-screen items-center bg-background p-2">
            <div className="w-full flex justify-between items-center px-8 py-4">
                <button
                    onClick={() => navigate("/upload-encode")}
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
                        onClick={() => navigate("/upload-decode")}
                        className="flex items-center gap-2 border border-border px-5 py-2 rounded-full hover:bg-secondary font-bold text-sm transition-colors shadow-sm"
                    >
                        <Unlock size={16} /> Decode
                    </button>
                </div>
            </div>

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
                                    <p className={"mt-32 font-semibold text-xl text-secondary-foreground px-30 text-center"}>Encode a message to see the modified image with your data hidden inside</p>
                                )
                            }
                        </div>
                        <div className={"absolute p-4 flex gap-4 bottom-1 right-1"}>
                            {modifiedImageUrl && (
                                <button
                                    onClick={handleDownloadAndTest}
                                    className={"border rounded-md border-emerald-500 bg-emerald-50 px-8 py-2 cursor-pointer text-emerald-700 font-bold hover:bg-emerald-100 transition-colors"}
                                >
                                    ↓ Download & Try Decoding
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full flex space-x-2 px-8 py-4">
                <div className="w-1/2">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4 border border-green-700 rounded-2xl p-4 bg-secondary">
                        <div className="pl-4 sm:pl-5">
                            <p className="mb-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Dimensions</p>
                            <p className="font-mono text-lg text-secondary-foreground">{originalImage.height}px x {originalImage.width}px</p>
                        </div>
                        <div className="border-l border-zinc-700/50 pl-4 sm:pl-5">
                            <p className="mb-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Total Pixels</p>
                            <p className="font-mono text-lg text-secondary-foreground">{(originalImage.data.length) / 4}</p>
                        </div>
                        <div className="border-l border-zinc-700/50 pl-4 sm:pl-5">
                            <p className="mb-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Total Colors</p>
                            <p className="font-mono text-lg text-secondary-foreground">{originalImage.data.length}</p>
                        </div>
                        <div className="border-l border-zinc-700/50 pl-4 sm:pl-5">
                            <p className="mb-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Capacity</p>
                            <p className="font-mono text-lg text-secondary-foreground">{bitsToMegabytes(availableBytes * 8)}</p>
                        </div>
                    </div>
                </div>

                <div className="w-1/2">
                    <div className={"flex-col border-2 border-black rounded-2xl overflow-hidden bg-secondary"}>
                        <div className="flex bg-secondary-foreground">
                            {(['text', 'image', 'audio', 'file'] as DataType[]).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => {
                                        setDataType(type);
                                        setFileError("");
                                    }}
                                    className={`flex-1 py-3 font-mono text-sm uppercase font-bold transition-colors ${
                                        dataType === type
                                            ? 'bg-secondary text-black'
                                            : 'text-gray-200 hover:text-gray-200'
                                    }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>

                        <div className={"px-6 pt-6"}>
                            {dataType === 'text' ? (
                                <textarea
                                    className={"w-full border p-4 rounded-md bg-white border-gray-300 focus:outline-1"}
                                    rows={4}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder={"Enter the secret message..."}
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-400 rounded-md bg-white hover:bg-gray-50 transition-colors relative">
                                    <input
                                        type="file"
                                        accept={
                                            dataType === 'image' ? 'image/*' :
                                                dataType === 'audio' ? 'audio/*' :
                                                    '*/*'
                                        }
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <p className="text-gray-600 font-bold">Click or drag {dataType} to upload</p>
                                    <p className="text-sm text-gray-500 mt-2">Max allowed size: {(availableBytes / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            )}

                            <div className="mt-4 p-4 border border-border rounded-lg bg-card">
                                <label className="flex items-center gap-3 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 accent-primary cursor-pointer"
                                        checked={isEncrypting}
                                        onChange={(e) => {
                                            setIsEncrypting(e.target.checked);
                                            setFileError("");
                                        }}
                                    />
                                    <span className="font-bold text-sm flex items-center gap-2">
                                        <Lock size={16} className={isEncrypting ? "text-primary" : "text-muted-foreground"} />
                                        Encrypt with Password (AES-GCM)
                                    </span>
                                </label>


                                {isEncrypting && (
                                    <div className="mt-4 relative">
                                        <Key size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter a strong password"
                                            className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-white focus:outline-primary"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="h-8 mt-2">
                                {fileError && <p className="text-red-600 text-sm font-semibold">{fileError}</p>}
                                {selectedFile && !fileError && dataType !== 'text' && (
                                    <p className="text-green-600 text-sm font-semibold">✓ Ready to encode: {selectedFile.name}</p>
                                )}
                            </div>
                        </div>

                        <div className={"p-4 flex gap-4 bg-secondary border-t border-border"}>
                            <button
                                className={"border rounded-md border-gray-400 bg-gray-200 px-8 py-2 cursor-pointer text-gray-800 font-bold disabled:opacity-50 disabled:cursor-not-allowed"}
                                onClick={encodeHandler}
                                disabled={(dataType !== 'text' && !selectedFile) || (dataType === 'text' && !message) || (isEncrypting && !password)}
                            >
                                {isEncrypting ? `Encrypt & Encode ${dataType}` : `Encode ${dataType}`}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default EncodePage