import { type ChangeEvent, type DragEvent, useState, useRef } from "react";

interface UploadProps {
    handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const UploadImage = ({ handleFileChange }: UploadProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            if (inputRef.current) {
                inputRef.current.files = files;
                const event = {
                    target: { files: files }
                } as unknown as ChangeEvent<HTMLInputElement>;
                handleFileChange(event);
            }
        }
    };

    return (
        <div className="w-full flex justify-center items-center">
            <label
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`w-full h-64 p-16 rounded-lg flex flex-col justify-center items-center border-2 border-dashed cursor-pointer transition-colors ${
                    isDragging
                        ? "bg-green-100 border-green-500"
                        : "bg-gray-50 border-gray-300 hover:bg-green-50"
                }`}
            >
                <svg
                    className="w-20 h-20 mb-4 text-gray-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 17h3a3 3 0 0 0 0-6h-.025a5.56 5.56 0 0 0 .025-.5A5.5 5.5 0 0 0 7.207 9.021C7.137 9.017 7.071 9 7 9a4 4 0 1 0 0 8h2.167M12 19v-9m0 0-2 2m2-2 2 2"
                    />
                </svg>
                <p className="text-gray-500 mb-1">
                    <strong>Click to upload</strong> or drag and drop
                </p>
                <p className="text-gray-500 text-sm">Only PNG Images supported</p>
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/png"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </label>
        </div>
    );
};

export default UploadImage;