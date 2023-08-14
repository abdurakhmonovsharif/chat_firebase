import React, { useRef } from 'react';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { v4 as uuid } from "uuid";
import { arrayUnion, collection, doc, getDocs, onSnapshot, query, serverTimestamp, Timestamp, updateDoc, where } from "firebase/firestore";
import Messages from '../messages/Messages';
import { Avatar, Button, Modal, Spinner } from 'flowbite-react';
import { useEffect } from 'react';
import ChatHeader from './ChatHeader';
import { useDispatch, useSelector } from 'react-redux';
import { db } from '../../DataBase/Firebase.Config'
import ChatFooter from './ChatFooter';
import { setChatState } from "../../redux/reducers/chatReducer";
const Chat = () => {
    const chat = useSelector((state) => state.chat)
    const currentUser = useSelector((state) => state.user.user);
    const formRef = useRef(null);
    const dispatch = useDispatch()
    //    send Hi message
    useEffect(() => {
        if (chat?.send_hi) {
            sendHiMessage()
        }
    }, [chat?.send_hi])
    const sendHiMessage = async () => {
        const now = new Date();
        const options = { hour12: true, hour: '2-digit', minute: '2-digit' };
        const currentTime = now.toLocaleTimeString('en-US', options);
        await updateDoc(doc(db, "chats", chat?.chat_id), {
            messages: arrayUnion({
                id: uuid(),
                messageInput: "Hi 👋",
                senderId: currentUser.uid,
                date: Timestamp.now(),
                currentTime,
            }),
        })
        await updateDoc(doc(db, "userChats", currentUser.uid), {
            [chat?.chat_id + ".lastMessage"]: {
                messageInput: "Hi 👋"
            },
            [chat?.chat_id + ".date"]: serverTimestamp(),
        })
        await updateDoc(doc(db, "userChats", chat?.user?.uid), {
            [chat?.chat_id + ".lastMessage"]: {
                messageInput: "Hi 👋"
            },
            [chat?.chat_id + ".date"]: serverTimestamp()
        })
        dispatch(setChatState({ ...chat, send_hi: false }))
    }
    return (
        <>
            <div className={`relative w-full flex ${chat.chat_id ? 'sm:flex lg:flex' : 'sm:hidden lg:flex'}`}>
                <div className="absolute inset-0 -z-10 bg-filter-blur bg-cover bg-no-repeat bg-center"
                    style={{ backgroundImage: `url(${chat.bg_image})` }} >
                </div>
                {
                    chat?.chat_id ?
                        <div className='w-full relative h-screen'>
                            <ChatHeader />
                            <Messages formRef={formRef} />
                            <ChatFooter formRef={formRef} />
                        </div> :
                        <div className='h-screen w-full flex flex-col items-center justify-center '>
                            {
                                currentUser ?
                                    <>
                                        <Avatar img={currentUser?.photoURL} bordered size={'xl'} rounded />
                                        <span className='font-medium text-[#FFF] text-lg mt-3'>{currentUser && (currentUser?.firstName + " " + currentUser?.lastName)} </span>
                                        <span className='text-[#FFF] font-normal text-sm'>Please select a chat to Start messaging.</span>
                                    </> :
                                    <Spinner size={'lg'} />
                            }
                        </div>
                }
            </div >

        </>

    );
}

export default Chat;
