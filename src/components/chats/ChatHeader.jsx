import React, { useState } from 'react'
import { Dropdown, Modal } from 'flowbite-react'
import { CiSearch } from 'react-icons/ci'
import { LuPaintbrush } from 'react-icons/lu'
import { AiOutlineMore } from 'react-icons/ai'
import { BsInfoCircle } from 'react-icons/bs'
import { BiSolidTrash, BiBlock } from 'react-icons/bi'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux'
import { clearChatState, setChatState } from '../../redux/reducers/chatReducer'
import { deleteDoc, deleteField, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../DataBase/Firebase.Config'
function ChatHeader() {
    const chat = useSelector((state) => state.chat);
    const currentUser = useSelector((state) => state.user.user);
    const [modalStatus, setModalStatus] = useState({ clearHistory: false, deleteAll: false })
    const dispatch = useDispatch()
    const showProfileInfo = () => {
        dispatch(setChatState({ ...chat, profile_info: { show: true, user: chat.user } }))
    }
    const showMobileProfileInfo = () => {
        dispatch(setChatState({ ...chat, mobileProfile_info: { show: true, user: chat.user } }))
    }
    const closeChat = () => {
        dispatch(setChatState({ ...chat, chat_id: null, user: null }))
    }
    const closeModal = (obj) => {
        setModalStatus(obj)
    }
    const openModal = (obj) => {
        setModalStatus(obj)
    }
    // clear history
    const sureClearHistory = () => {
        clearMessageHistory()
        closeModal({ clearHistory: false, deleteAll: false })
    }
    const clearMessageHistory = async () => {
        const washingtonRef = doc(db, "chats", chat?.chat_id);
        await updateDoc(washingtonRef, {
            messages: []
        })
        await updateDoc(doc(db, "userChats", currentUser?.uid), {
            [chat?.chat_id + ".lastMessage"]: {
                messageInput: ''
            },
            [chat?.chat_id + ".lastTime"]: '',
            [chat?.chat_id + ".date"]: '',
        })
        await updateDoc(doc(db, "userChats", chat?.user?.uid), {
            [chat?.chat_id + ".lastMessage"]: {
                messageInput: ''
            },
            [chat?.chat_id + ".lastTime"]: '',
            [chat?.chat_id + ".date"]: ''
        })
    }
    // delete chat 
    const deleteChat = async () => {
        const chat_id = chat.chat_id
        const refCurrentUser = doc(db, 'userChats', currentUser?.uid);
        const refUserUser = doc(db, 'userChats', chat.user?.uid);
        await updateDoc(refCurrentUser, {
            [chat_id]: deleteField()
        });
        await updateDoc(refUserUser, {
            [chat_id]: deleteField()
        });
        await deleteDoc(doc(db, "chats", chat_id));
    }
    const sureDeleteChat = () => {
        deleteChat()
        closeModal({ clearHistory: false, deleteAll: false })
        dispatch(clearChatState())
    }
    return (
        <div className={`flex w-full !relative border-bottom py-3 px-2 h-[53px] items-center justify-between bg-color`}>
            <div className="flex items-center justify-start  gap-2 w-full">
                <button onClick={closeChat}>
                    <IoIosArrowRoundBack color='#000' size={28} className='block lg:hidden cursor-pointer ' />
                </button>
                <span className='text-[#3A405A] text-lg whitespace-nowrap'>{chat?.user && (chat?.user?.firstName + " " + chat?.user?.lastName)}</span>
            </div>
            <div className="flex items-center justify-end w-[14%] gap-1">
                {/* <CiSearch size={24} color='#3A405A' className='cursor-pointer hidden lg:flex' /> */}
                <Dropdown
                    className='z-30'
                    inline
                    label={<AiOutlineMore size={24} className='cursor-pointer' color='#3A405A' />}
                >
                    <Dropdown.Item className='gap-4 lg:flex hidden whitespace-nowrap' onClick={showProfileInfo}>
                        <BsInfoCircle size={22} color='#3A405A' />
                        View Info
                    </Dropdown.Item>
                    <Dropdown.Item className='gap-4 flex lg:hidden whitespace-nowrap' onClick={showMobileProfileInfo}>
                        <BsInfoCircle size={22} color='#3A405A' />
                        View Info
                    </Dropdown.Item>
                    <Dropdown.Item className='gap-4 lg:hidden '>
                        <CiSearch size={22} color='#3A405A' />
                        Search
                    </Dropdown.Item>
                    <Dropdown.Item className='gap-4' onClick={() => openModal({ deleteAll: true, clearHistory: false })}>
                        <BiSolidTrash size={22} color='#3A405A' />
                        Delete
                    </Dropdown.Item>
                    <Dropdown.Item className='gap-4' onClick={() => openModal({ deleteAll: false, clearHistory: true })}>
                        <LuPaintbrush size={22} color='#3A405A' />
                        Clear history
                    </Dropdown.Item>
                </Dropdown>
            </div>
            {/* clear history modal  */}
            <Modal size={'sm'} show={modalStatus.clearHistory}>
                <Modal.Body>
                    <Modal.Body>
                        <div className="w-full h-full flex justify-center">
                            <button onClick={() => closeModal({ clearHistory: false, deleteAll: false })} type="button" className="bg-white z-10 rounded-md absolute right-2 top-2 p-1.5 inline-flex items-center justify-center text-gray-400 hover:text-[#111827] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                                <span className="sr-only">Close menu</span>
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <div className="p-2 text-center">
                                <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                    Are you sure you want to clear history?</h3>
                                <button onClick={sureClearHistory} type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                                    Yes, I'm sure
                                </button>
                                <button onClick={() => closeModal({ clearHistory: false, deleteAll: false })} type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">No, cancel</button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal.Body>
            </Modal>
            {/* delete chat modal  */}
            <Modal size={'sm'} show={modalStatus.deleteAll}>
                <Modal.Body>
                    <Modal.Body>
                        <div className="w-full h-full flex justify-center">
                            <button onClick={() => closeModal({ clearHistory: false, deleteAll: false })} type="button" className="bg-white z-10 rounded-md absolute right-2 top-2 p-1.5 inline-flex items-center justify-center text-gray-400 hover:text-[#111827] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                                <span className="sr-only">Close menu</span>
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <div className="p-2 text-center">
                                <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                    Are you sure you want to delete chat?</h3>
                                <button onClick={sureDeleteChat} type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                                    Yes, I'm sure
                                </button>
                                <button onClick={() => closeModal({ clearHistory: false, deleteAll: false })} type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">No, cancel</button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default ChatHeader
