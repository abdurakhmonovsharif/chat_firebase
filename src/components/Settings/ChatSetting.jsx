import { collection, getDocs } from 'firebase/firestore'
import React from 'react'
import { useEffect } from 'react'
import { BsArrowLeft } from 'react-icons/bs'
import { db } from '../../DataBase/Firebase.Config'
import { useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { setChatState } from "../../redux/reducers/chatReducer";
function ChatSetting({ setSettingState }) {
    const [chatImages, setChatImages] = useState([]);
    const dispatch = useDispatch();
    const chat = useSelector((state) => state.chat);
    useEffect(() => {
        getChatImages()
    }, [])
    const getChatImages = async () => {
        let selectedImageFromLocal = localStorage.getItem("chat_bg_image")
        try {
            let ref = collection(db, "chat_images")
            const data = await getDocs(ref);
            let array = data.docs.map(item => ({ ...item.data(), id: item.id, select: item.data()?.url === selectedImageFromLocal }))
            setChatImages(array);
        } catch (err) {
        }
    }
    const changeChatImage = (id) => {
        const updatedImages = chatImages.map(item => {
            if (item.id === id) {
                localStorage.setItem("chat_bg_image", item.url)
                dispatch(setChatState({ ...chat, bg_image: item.url }))
                return { ...item, select: true };
            } else {
                return { ...item, select: false };
            }
        });

        setChatImages(updatedImages);
    };
    return (
        <div className='w-full p-2 h-full relative'>
            <button onClick={() => setSettingState(prev => ({ ...prev, edit_chat: false }))} type="button" className="bg-white z-10 hover:text-[#111827] rounded-md absolute -left-2 -top-2 p-1.5 inline-flex items-center justify-center text-gray-400  hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                <BsArrowLeft className="h-5 w-5" />
            </button>
            <div className="w-full h-full mt-4 ">
                <div className='w-full grid grid-cols-2 gap-4  justify-center p-2'>
                    {
                        chatImages.map(item => {
                            return (
                                <div key={item.id} className="w-full h-full flex flex-col cursor-pointer items-center gap-3" onClick={() => changeChatImage(item.id)}>
                                    <img
                                        className='rounded-lg h-full w-full select-none '
                                        src={item.url} alt='...' />
                                    <div className={`p-1.5  border-2 rounded-[50%] ${item.select ? 'bg-[#088EAF]' : ''}`}></div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div >
    )
}

export default ChatSetting
