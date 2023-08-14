import React, { useEffect, useRef, useState } from 'react'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { BsPlusCircle } from 'react-icons/bs'
import { AiOutlineSend } from 'react-icons/ai'
import { FiSmile } from 'react-icons/fi'
import { IoIosCloseCircleOutline } from 'react-icons/io'
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { v4 as uuid } from "uuid";
import { db, storage } from "../../DataBase/Firebase.Config";
import { arrayUnion, doc, getDoc, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
import { useDispatch, useSelector } from 'react-redux'
import { Button, Modal } from 'flowbite-react'
import { ModalHeader } from 'flowbite-react/lib/esm/components/Modal/ModalHeader'
import { ModalBody } from 'flowbite-react/lib/esm/components/Modal/ModalBody'
import { BsPlayCircle, BsFileEarmark } from 'react-icons/bs'
import { toBase64 } from '../../Helpers/Helpler'
import { ModalFooter } from 'flowbite-react/lib/esm/components/Modal/ModalFooter'
import { clearChatState } from '../../redux/reducers/chatReducer'

function ChatFooter({ formRef }) {
    const chat = useSelector((state) => state.chat)
    const currentUser = useSelector((state) => state.user.user)
    //file types
    const typesForImages = ["png", "jpg", "jpeg", "svg", "webp"];
    const typesForVideos = ["mp4", "mov", "wmv", "avi", "avchd", "mkv"];
    const audioFileTypes = [
        "mp3", "wav", "ogg", "flac", "aac", "wma", "m4a", "aiff", "amr", "mid", "opus"
    ];
    const [showEmojies, setShowEmojies] = useState(false)
    const [showModal, setShowModal] = useState({ video: false, image: false, file: false, music: false });
    const [file, setFile] = useState({ data: '', size: '', type: '', name: '', file: null })
    const [disableSentBtn, setDisabledSentBtn] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const dispatch = useDispatch()
    // focus message input
    useEffect(() => {
        if (formRef.current) {
            formRef.current.messageInput.focus()
        }
    }, [])
    const handeSubmit = async (e) => {
        e.preventDefault();
        const messageInput = e.target?.messageInput?.value;
        const now = new Date();
        const options = { hour12: true, hour: '2-digit', minute: '2-digit' };
        const currentTime = now.toLocaleTimeString('en-US', options);
        resetForm();
        if (file.file !== null) {
            setDisabledSentBtn(true)
            try {
                //sent file
                const storageRef = ref(storage, file.name);
                const uploadTask = uploadBytesResumable(storageRef, file.file);
                uploadTask.on("state_changed",
                    (snapshot) => {
                        const progress = Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 100)
                        setUploadProgress(progress)
                        if (file.data === "") return;
                    },
                    (error) => {
                        // err
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                            setFile({ data: '', size: '', type: '', name: '', file: null })
                            setShowModal({ file: false, image: false, video: false })
                            setUploadProgress(0)
                            setDisabledSentBtn(false)
                            await updateDoc(doc(db, "chats", chat?.chat_id), {
                                messages: arrayUnion({
                                    id: uuid(),
                                    senderId: currentUser.uid,
                                    date: Timestamp.now(),
                                    file: {
                                        url: downloadURL,
                                        type: file.type,
                                        size: file.size,
                                        name: file.name
                                    },
                                    currentTime
                                }),
                            })
                            await updateDoc(doc(db, "userChats", currentUser.uid), {
                                [chat?.chat_id + ".lastMessage"]: {
                                    messageInput: 'you: ' + file.type
                                },
                                [chat?.chat_id + ".lastTime"]: currentTime,
                                [chat?.chat_id + ".date"]: serverTimestamp(),
                            })
                            await updateDoc(doc(db, "userChats", chat?.user?.uid), {
                                [chat?.chat_id + ".lastMessage"]: {
                                    messageInput: file.type
                                },
                                [chat?.chat_id + ".lastTime"]: currentTime,
                                [chat?.chat_id + ".date"]: serverTimestamp()
                            })
                        });
                    }
                );
            } catch {
            }
        } else {
            let boolean = false;
            for (var i = 0; i < messageInput.length; i++) {
                var charValue = messageInput.charCodeAt(i);
                if (charValue != 32) {
                    boolean = true;
                    break;
                }
            }
            // sent sms
            try {
                if (boolean) {
                    // check exists messages
                    const res = await getDoc(doc(db, "chats", chat?.chat_id))
                    if (!res.exists()) {
                        dispatch(clearChatState())
                        return
                    }
                    if (chat?.isEdit.item != null) {
                        console.log(chat.isEdit.item);
                        return
                    }
                    setShowEmojies(false);
                    await updateDoc(doc(db, "chats", chat?.chat_id), {
                        messages: arrayUnion({
                            id: uuid(),
                            messageInput,
                            senderId: currentUser.uid,
                            date: Timestamp.now(),
                            currentTime,
                        }),
                    })
                    await updateDoc(doc(db, "userChats", currentUser.uid), {
                        [chat?.chat_id + ".lastMessage"]: {
                            messageInput: 'you: ' + messageInput
                        },
                        [chat?.chat_id + ".lastTime"]: currentTime,
                        [chat?.chat_id + ".date"]: serverTimestamp(),
                    })
                    await updateDoc(doc(db, "userChats", chat?.user?.uid), {
                        [chat?.chat_id + ".lastMessage"]: {
                            messageInput
                        },
                        [chat?.chat_id + ".lastTime"]: currentTime,
                        [chat?.chat_id + ".date"]: serverTimestamp()
                    })
                }
            } catch {
                // err
            }
        }
    };
   
    useEffect(() => {
        resetForm()
    }, [showModal]);
    const resetForm = () => {
        formRef?.current.reset();
    }
    const selectFile = async (e) => {
        const files = e.target.files;
        if (files.length === 1) {
            const file = files[0];
            const name = file.name;
            const sizeInBytes = file.size;
            let size;
            if (sizeInBytes >= 1024 * 1024 * 1024) {
                size = (sizeInBytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
            } else {
                size = (sizeInBytes / (1024 * 1024)).toFixed(2) + " MB";
            }
            await toBase64(file).then(data => {
                const typeFromName = name.split('.').pop();
                let type = "";
                if (typesForVideos.includes(typeFromName)) {
                    setShowModal(prev => ({ ...prev, video: true }))
                    type = 'video';
                } else if (typesForImages.includes(typeFromName)) {
                    setShowModal(prev => ({ ...prev, image: true }))
                    type = 'image';
                }
                else if (audioFileTypes.includes(typeFromName)) {
                    setShowModal(prev => ({ ...prev, music: true }))
                    type = 'music';
                } else {
                    setShowModal(prev => ({ ...prev, file: true }))
                    type = 'file';
                }
                setFile({ data, size, type, name, file })
            })
        }
    };
    const handleEmojiClick = (data) => {
        formRef.current.messageInput.value += data.native;
    }
    const modalClose = () => {
        setShowModal({ file: false, image: false, video: false })
    }

    return (
        <>
            {
                showEmojies &&
                <div className="fixed bottom-14 lg:right-16 -right-0.5 lg:w-auto md:w-auto w-full">
                    <Picker theme="light" data={data} onEmojiSelect={handleEmojiClick} />
                </div>
            }
            {/* file Modal */}
            <Modal size={'lg'} show={showModal.file || showModal.image || showModal.video || showModal.music} onClose={modalClose}
                className='backdrop-blur-sm'>
                <ModalHeader>{showModal.file ? 'Send file' : showModal.image ? 'Send image' : showModal.music ? 'Send audio' : 'Send video '}</ModalHeader>
                <ModalBody className=''>
                    {
                        showModal.video ?
                            <div className="relative flex  justify-center">
                                <video src={file.data} className='blur-[0.5px] max-h-[400px]' />
                                <BsPlayCircle size={60}
                                    className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  text-gray-200 ' />
                            </div> :
                            showModal.image ?
                                <div className="!max-h-[370px] grid">
                                    <img src={file.data} alt={'...image'} className='object-contain !max-h-[370px]  w-full h-full mx-auto' />
                                </div> :
                                <div className='flex items-center justify-start gap-3'>
                                    <div className='relative w-[55px]'>
                                        <BsFileEarmark size={55} />
                                        <span
                                            className='absolute text-xs top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>{file?.name.split('.')[file?.name.split('.').length - 1]}</span>
                                    </div>
                                    <span>{file.name}</span>
                                </div>
                    }
                </ModalBody>
                <ModalFooter className='justify-between'>
                    <span>Size:{file.size}</span>
                    <div className='flex items-center justify-between gap-3'>
                        <Button onClick={handeSubmit} className="bg-[#7F56DA] hover:!bg-[#5d3da3]"
                            disabled={disableSentBtn}>{disableSentBtn ? uploadProgress + "%" : 'Send'}</Button>
                    </div>
                </ModalFooter>
            </Modal>
            <form onSubmit={handeSubmit} ref={formRef}
                className='w-full flex bg-color  items-center justify-between absolute bottom-0 py-1 px-2 mt-2'>
                <label>
                    <BsPlusCircle size={22} color='#AAAAAA' className='cursor-pointer' />
                    <input type="file" hidden onChange={selectFile} />
                </label>
                <input name={'messageInput'} type="text"
                    placeholder='Type your message here...' className='w-full  border-none outline-none bg-color' />
                <div className="flex items-center gap-2">
                    {
                        showEmojies ?
                            <IoIosCloseCircleOutline onClick={() => setShowEmojies(false)} size={25} color='#AAAAAA'
                                className='cursor-pointer' /> :
                            <FiSmile onClick={() => setShowEmojies(true)} size={25} color='#AAAAAA'
                                className='cursor-pointer' />
                    }
                    <button type='submit' className="bg-[#7F56DA] hover:bg-[#5d3da3] p-3 rounded-[50%] cursor-pointer">
                        <AiOutlineSend size={21} color="#FFF" />
                    </button>
                </div>
            </form>
        </>
    )
}

export default ChatFooter
