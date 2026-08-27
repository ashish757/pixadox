
interface UploadPageProps {
    children: React.ReactNode;
}

const UploadPage = ({children}: UploadPageProps) => {
    return (
        <main className="flex-col min-h-screen items-center bg-gray-100 p-12">
            <h1 className="text-4xl font-bold text-emerald-400 text-center mb-6">
                Welcome to Pixadox
            </h1>



            {children}

            <div className="flex px-20 items-center justify-center w-full space-x-3 mt-8">
                <div className="flex items-center justify-center w-full p-8 border border-green-200 bg-green-50">
                    <p className="text-lg text-gray-700">
                        Pixadox is a web application that allows you to encode and decode messages in images using steganography.
                    </p>
                </div>
                <div className="flex items-center justify-center w-full p-8 border border-green-200 bg-green-50">
                    <p className="text-lg text-gray-700">
                        Pixadox is a web application that allows you to encode and decode messages in images using steganography.
                    </p>
                </div>
                <div className="flex items-center justify-center w-full p-8 border border-green-200 bg-green-50">
                    <p className="text-lg text-gray-700">
                        Pixadox is a web application that allows you to encode and decode messages in images using steganography.
                    </p>
                </div>
            </div>

        </main>
    )
}


export default UploadPage;