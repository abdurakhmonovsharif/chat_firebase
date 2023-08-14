import { Toast } from "flowbite-react"
import { useState, useEffect } from "react"
import { HiCheck } from 'react-icons/hi'
import { useDispatch } from "react-redux"

const HandleToast = ({ status, text }) => {
    const color = status === "warning" ? 'bg-yellow-100 text-yellow-500' : status === "error" ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500'
    const [showToast, setShowToast] = useState(true);

    useEffect(() => {
        if (showToast) {
            const timeout = setTimeout(() => {
                setShowToast(false);
            }, 3000);

            return () => clearTimeout(timeout);
        }
    }, [showToast]);

    const handleClose = () => {
        setShowToast(false);
    };

    return (<>
        {showToast && (<Toast
            className={`toast absolute top-3 right-3 z-[102] shadow-md border-full ${showToast ? 'transition ease-in duration-400' : 'transition ease-in-out duration-400'}`}>
            <div className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${color}`}>
                <HiCheck className="h-5 w-5" />
            </div>
            <div className="ml-3 text-sm font-normal">
                {text}
            </div>
            <Toast.Toggle onClick={handleClose} />
        </Toast>)}
    </>)
}

const copyToClipBoard = (text) => {
    if (text != '') {
        const textField = document.createElement('textarea');
        textField.innerText = text
        document.body.appendChild(textField)
        textField.select()
        document.execCommand('copy')
        textField.remove()
        return true;
    } else {
        return false;
    }

}

const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
});


export { HandleToast, copyToClipBoard, toBase64 }
