import UploadImage from "../components/UploadImage.tsx";
import  {getImageData} from "../util/loadImageData.ts";
import {type ChangeEvent} from "react";
import {useNavigate} from "react-router-dom";


const UploadEncodePage = () => {
    const navigate = useNavigate();

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file= e.target.files?.[0];
        if(!file) return;

        const imgUrl = URL.createObjectURL(file);
        const data = await getImageData(imgUrl);

        if(data) navigate("/encode", { state: { originalImage: data } });
    }


    return (
        <main className="flex-col min-h-screen items-center bg-background p-12">
        <h1>Encode</h1>

            <UploadImage handleFileChange={handleFileChange} />


        </main>
    )
}


export default UploadEncodePage;