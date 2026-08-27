import {getImageData} from "./util/loadImageData.ts";
import { useState} from "react";
import UploadImage from "./components/UploadImage.tsx";
import {type ChangeEvent} from "react";
import UploadPage from "./UploadPage.tsx";
import EncodePage from "./EncodePage.tsx";

export default function App() {
    const [originalImage, setOriginalImage] = useState<ImageData | null>(null);




    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file= e.target.files?.[0];
        if(!file) return;

        const imgUrl = URL.createObjectURL(file);
        const data = await getImageData(imgUrl);
        setOriginalImage(data);
    }


    if(originalImage == null) return (
        <UploadPage>
            <UploadImage handleFileChange={(e) => handleFileChange(e)} />
        </UploadPage>
    )


    return <EncodePage originalImage={originalImage}/>
}