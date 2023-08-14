import { Timestamp, arrayUnion, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { db } from '../../DataBase/Firebase.Config';
import { BiSolidTrash } from 'react-icons/bi'
import { BsFileEarmark } from 'react-icons/bs'
import { MdContentCopy, MdOutlineModeEditOutline, MdDownload, MdFavorite } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux';
import { ContextMenuTrigger, ContextMenu, ContextMenuItem } from 'rctx-contextmenu';
import { Modal, Spinner } from 'flowbite-react';
import { setChatState } from '../../redux/reducers/chatReducer';
import { copyToClipBoard } from '../../Helpers/Helpler';
import { useNavigate } from 'react-router-dom';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { v4 as uuid } from "uuid";
const Messages = ({ formRef }) => {
    const currentUser = useSelector((state) => state.user.user)
    const chat = useSelector((state) => state.chat)
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [messages, setMessages] = useState({ data: [], loading: false })
    const [deleteSureModal, setDeleteSureModal] = useState({ show: false, message_id: null })
    const messagesContainerRef = useRef(null)
    useEffect(() => {
        if (messagesContainerRef.current && !deleteSureModal.show) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);
    useEffect(() => {
        if (chat?.chat_id) {
            setMessages({ ...messages, loading: true })
            const unSub = onSnapshot(doc(db, "chats", chat?.chat_id), (doc) => {
                if (doc.exists() && doc.data().messages?.length >= 1) {
                    setMessages({ data: doc.data().messages, loading: false })
                } else if (doc.exists() && doc.data().messages?.length === 0) {
                    setMessages({ data: [], loading: false })
                }
            });
            return () => {
                unSub();
            }
        }
    }, [chat?.chat_id])
    const copy = (text) => {
        text && copyToClipBoard(text);
    }
    //    send Hi! message
    const sendHiMessage = () => {
        dispatch(setChatState({ ...chat, send_hi: true }))
    }
    // Save as
    const saveAs = (url, name) => {
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = name;
        anchor.target = '_blank';
        anchor.style.display = 'none';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    }
    // navigateToPhotoViewer
    const navigateToPhotoViewer = (url) => {
        dispatch(setChatState({ ...chat, photo_id: url }))
        navigate("/home/photo_viewer")
    }
    // delete message
    const deleteItem = async (id) => {
        const washingtonRef = doc(db, "chats", chat?.chat_id);
        const updatedArray = messages.data.filter(item => item.id !== id);
        await updateDoc(washingtonRef, {
            messages: updatedArray
        })
    }
    // update message 
    const updateItem = (item) => {
        let value = item.messageInput;
        if (formRef.current) {
            formRef.current.messageInput.value = value;
        }
        dispatch(setChatState({ ...chat, isEdit: { item: { messageInput: item.messageInput, id: item.id }, messages: messages.data } }))
    }
    const closeDeleteSureModal = () => {
        setDeleteSureModal({ show: false, message_id: null })
    }
    const openDeleteSureModal = (id) => {
        setDeleteSureModal({ show: true, message_id: id })
    }
    const sureDelete = async () => {
        await deleteItem(deleteSureModal.message_id).then(() => {
            setDeleteSureModal({ show: false, message_id: null })
        })
    }
    // saveToFavorite
    const saveToFavorite = (type, name, url) => {
        switch (type) {
            case 'image':
                addPicuture(url, name);
                break;
            case 'music':
                addMusic(url, name);
                break;
            case 'video':
                addVideo(url, name);
                break;
        }
    }
    // add music to user and current user 
    const addMusic = async (url, name) => {
        await updateDoc(doc(db, "userFiles", currentUser?.uid), {
            musics: arrayUnion({
                id: uuid(),
                url,
                name,
                date: Timestamp.now(),
            }),
        })
    }
    // add video to user and current user 
    const addVideo = async (url, name) => {

        await updateDoc(doc(db, "userFiles", currentUser?.uid), {
            videos: arrayUnion({
                id: uuid(),
                url,
                name,
                date: Timestamp.now(),
            }),
        })
    }
    // add picture to user and current user 
    const addPicuture = async (url, name) => {

        await updateDoc(doc(db, "userFiles", currentUser?.uid), {
            pictures: arrayUnion({
                id: uuid(),
                url,
                name,
                date: Timestamp.now(),
            }),
        })
    }
    // UI
    const UserCard = ({ lastText, id, lastTime, file }) => <div className="flex justify-start relative max-w-[65%] sm:max-w-[90%] ">
        <ContextMenuTrigger
            id={`contextMenu${id}`}
        >
            <div
                className={`${file?.type === "video" ? '!pb-[31.5px] !pt-1 !px-1' : file?.type === "image" && '!p-0'}  bg-[#F5F6FA] w-fit px-3 pt-1 pb-1   rounded-xl  flex items-end justify-between gap-2  relative`}
                id={`contextMenu${id}`}>
                {file?.type === "image" ? <div className={'relative cursor-pointer'} onClick={() => navigateToPhotoViewer(file?.url)}>
                    <img id={file.url} src={file.url} className={'rounded-lg object-cover sm:max-w-none sm:w-full !max-w-[420px] !max-h-[435px]'} alt={file.name} />
                    <span
                        className=' bg-[rgba(0,0,0,0.5)] rounded-lg p-0.5 absolute right-1.5 bottom-1.5 text-[11px] text-white select-none whitespace-nowrap'>{lastTime}</span>
                </div> : file?.type === "video" ? <div className={'min-w-[320px] object-contain '}>
                    <video controls={true} src={file?.url} className={'!w-[320px] rounded-lg'} width={320} />
                    <span
                        className=' absolute right-1 bg-[rgba(0,0,0,0.5)] p-0.5 rounded-lg bottom-1.5 text-[11px] text-white select-none whitespace-nowrap'>{lastTime}</span>

                </div> : file?.type === "file" ? <div className='flex items-center justify-start gap-3'>
                    <div className='relative w-[44px]'>
                        <BsFileEarmark size={44} />
                        <span
                            className='text-xs absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>{file?.name.split('.')[file?.name.split('.').length - 1]}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span>{file?.name}</span>
                        <span className='text-sm'>{file?.size}</span>
                    </div>
                </div> : file?.type === "music" ? <div className=' flex flex-col items-end gap-2 !min-w-[420px] !max-w-[420px] sm:!w-full sm:min-w-none sm:max-w-none' >
                    <AudioPlayer header={
                        <span>{file?.name}</span>
                    } src={file?.url} className='!w-full rounded-lg' />
                    <span
                        className=' text-[11px] text-[#3A405A] select-none whitespace-nowrap'>{lastTime}</span>
                </div> : <>
                    <span className='break-all'>
                        {lastText}
                    </span>
                    <span className='ml-2  text-[11px] text-[#3A405A] select-none whitespace-nowrap'>{lastTime}</span>
                </>

                }
            </div>
        </ContextMenuTrigger>
        <ContextMenu id={`contextMenu${id}`}>
            <ContextMenuItem onClick={() => openDeleteSureModal(id)} >
                <div className="flex items-center justify-start gap-4 text-sm">
                    <BiSolidTrash /> Delete
                </div>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => copy(lastText)}>
                <div className="flex items-center justify-start gap-4 text-sm">
                    <MdContentCopy /> Copy
                </div>
            </ContextMenuItem>
            {file?.type ? <ContextMenuItem onClick={() => saveAs(file?.url, file?.name)}>
                <div className="flex items-center justify-start gap-4 text-sm">
                    <MdDownload /> Save as
                </div>
            </ContextMenuItem>
                : <></>}
            {file?.type === "video" || file?.type === "music" || file?.type === "image" ? <ContextMenuItem onClick={() => saveToFavorite(file?.type, file?.name, file?.url)}>
                <div className="flex items-center justify-start gap-4 text-sm">
                    <MdFavorite /> Save to favorite
                </div>
            </ContextMenuItem> : <></>}
        </ContextMenu>
    </div>;
    const CurrentUserCard = ({ lastText, id, lastTime, file, item }) => <div className="flex relative justify-end max-w-[60%] sm:max-w-[90%]">
        <ContextMenuTrigger
            id={`contextMenu${id}`}
        >
            <div
                className={`${file?.type == "video" ? "!pb-[31.5px] !pt-1 !px-1" : file?.type === "image" && '!p-0 !pb-0'} bg-[#7F56DA]   w-fit rounded-xl px-3 pt-1 pb-1 flex items-end   justify-between gap-2  relative`}
                id={`contextMenu${id}`}>
                {file?.type === "image" ? <div className={'relative cursor-pointer'} onClick={() => navigateToPhotoViewer(file?.url)}>
                    <img src={file.url} className={'rounded-lg object-cover !max-w-[420px] sm:!w-full sm:max-w-none'} alt={file.name} />
                    <span
                        className=' bg-[rgba(0,0,0,0.5)] rounded-lg p-0.5 absolute  right-1.5 bottom-1.5 text-[11px] text-white select-none whitespace-nowrap'>{lastTime}</span>
                </div> : file?.type === "video" ? <div className={'sm:min-w-[85%] !w-[320px] object-contain rounded-lg'}>
                    <video controls={true} src={file?.url} className={' sm:!w-full rounded-lg'} />
                    <span
                        className=' absolute right-1.5 bg-[rgba(0,0,0,0.5)] p-0.5 rounded-lg  bottom-1.5 text-[11px] text-white select-none whitespace-nowrap'>{lastTime}</span>

                </div> : file?.type === "file" ? <div className=' text-white flex items-center justify-start gap-3'>
                    <div className='relative w-[44px]'>
                        <BsFileEarmark size={44} />
                        <span
                            className='text-xs absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>{file?.name.split('.')[file?.name.split('.').length - 1]}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span>{file?.name}</span>
                        <span className='text-sm'>{file?.size}</span>
                    </div>
                </div> : file?.type === "music" ? <div className=' flex flex-col items-end gap-2 !min-w-[420px] !max-w-[420px] sm:!w-full sm:min-w-none sm:max-w-none' >
                    <AudioPlayer header={
                        <span>{file?.name}</span>
                    } src={file?.url} className='!w-full rounded-lg' />
                    <span
                        className=' text-[11px] text-white select-none whitespace-nowrap'>{lastTime}</span>
                </div> : <>
                    <span className='break-all text-white'>
                        {lastText}
                    </span>
                    <span
                        className=' text-[11px] text-white select-none whitespace-nowrap'>{lastTime}</span>
                </>
                }
            </div>
        </ContextMenuTrigger>
        <ContextMenu id={`contextMenu${id}`}>
            <ContextMenuItem onClick={() => openDeleteSureModal(id)} >
                <div className="flex items-center justify-start gap-4 text-sm" >
                    <BiSolidTrash /> Delete
                </div>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => copy(lastText)}>
                <div className="flex items-center justify-start gap-4 text-sm">
                    <MdContentCopy /> Copy
                </div>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => updateItem(item)} >
                <div className="flex items-center justify-start gap-4 text-sm">
                    <MdOutlineModeEditOutline /> Edit
                </div>
            </ContextMenuItem>
            {file?.type ? <ContextMenuItem onClick={() => saveAs(file?.url, file?.name)}>
                <div className="flex items-center justify-start gap-4 text-sm">
                    <MdDownload /> Save as
                </div>
            </ContextMenuItem> : <></>}
            {file?.type === "video" || file?.type === "music" || file?.type === "image" ? <ContextMenuItem onClick={() => saveToFavorite(file?.type, file?.name, file?.url)}>
                <div className="flex items-center justify-start gap-4 text-sm">
                    <MdFavorite /> Save to favorite
                </div>
            </ContextMenuItem> : <></>}
        </ContextMenu>
    </div>;
    return (<div style={{ overflowY: 'auto', height: `calc(100vh - 106px)`, width: "100%" }}
        ref={messagesContainerRef}>
        {/* Modal */}
        <Modal show={deleteSureModal.show} size={'sm'}>
            <Modal.Body>
                <div className="w-full h-full flex justify-center">
                    <button onClick={closeDeleteSureModal} type="button" className="bg-white z-10 rounded-md absolute right-2 top-2 p-1.5 inline-flex items-center justify-center text-gray-400 hover:text-[#111827] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                        <span className="sr-only">Close menu</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div className="p-2 text-center">
                        <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete this message?</h3>
                        <button onClick={sureDelete} type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                            Yes, I'm sure
                        </button>
                        <button onClick={closeDeleteSureModal} type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">No, cancel</button>
                    </div>
                </div>


            </Modal.Body>
        </Modal>
        {messages.loading ? <div className='w-full h-full flex items-center justify-center'>
            <Spinner size={'lg'} />
        </div> : !messages.loading && messages.data.length === 0 ?
            <div className='w-full h-full flex items-center justify-center'>
                <button onClick={sendHiMessage}
                    className='text-[#FFF] font-normal text-lg border rounded-lg py-1 px-[9px] hover:bg-[#7F56DA] transition-all duration-300'>
                    Send Hi! 👋
                </button>
            </div> : <div className={`w-full flex flex-col py-3 lg:px-4 sm:px-1 md:px-2 gap-3 relative `}>
                {messages.data.map(item => {
                    if (item.senderId === currentUser?.uid) {
                        return <div className='flex items-center justify-end' key={item.id}>
                            <CurrentUserCard lastText={item.messageInput} key={item.id} id={item.id}
                                lastTime={item.currentTime} file={item?.file} date={item.date} item={item} />
                        </div>
                    } else {
                        return <UserCard lastText={item.messageInput} key={item.id} id={item.id}
                            lastTime={item.currentTime} file={item.file} date={item.date} />
                    }
                })}
            </div>}
    </div>

    );
}

export default Messages;
