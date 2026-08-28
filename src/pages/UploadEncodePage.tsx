import UploadImage from "../components/UploadImage.tsx";
import  {getImageData} from "../util/loadImage.ts";
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

            <div className={"flex-col items-center gap-2 mb-10 px-40"}>
                <h1 className="text-3xl">Upload an Image to Encode some data in it</h1>
                <p className="text-lg text-gray-500">Images are not uploaded to server, all the processing is done on device</p>
            </div>

            <UploadImage handleFileChange={handleFileChange} />


        </main>
    )
}


export default UploadEncodePage;