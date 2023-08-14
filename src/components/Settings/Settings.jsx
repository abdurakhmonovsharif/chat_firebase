import { Avatar, Dropdown, Modal } from 'flowbite-react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearSideBarStates } from '../../redux/reducers/sidebarReducer'
import { HandleToast, copyToClipBoard } from '../../Helpers/Helpler';
import { useState } from 'react';
import { BiDotsVerticalRounded, BiSolidUser } from 'react-icons/bi'
import { BsFillChatFill } from 'react-icons/bs'
import { MdLanguage } from 'react-icons/md'
import { FiLogOut } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom';
import EditProfile from './EditProfile';
import ChatSetting from './ChatSetting';
import { clearSearchState } from '../../redux/reducers/searchReducer';
import { clearChatState } from '../../redux/reducers/chatReducer';
import { clearUser } from '../../redux/reducers/userReducser';
function Settings() {
    const sidebarState = useSelector((state) => state.sidebar);
    const currentUser = useSelector((state) => state.user.user);
    const [settingState, setSettingState] = useState({ edit_profile: false, edit_chat: false })
    const dispatch = useDispatch();
    const [showToast, setShowToast] = useState(false)
    const navigate = useNavigate()
    const logOut = () => {
        navigate("/login");
        localStorage.removeItem("auth")
        dispatch(clearSideBarStates())
        dispatch(clearSearchState())
        dispatch(clearChatState())
        dispatch(clearUser())
    }
    const copyUserName = () => {
        const success = copyToClipBoard(currentUser?.userName)
        if (success) {
            setShowToast(true)
        }
    }
    const closeModal = () => {
        dispatch(clearSideBarStates())
        setSettingState({ edit_chat: false, edit_profile: false })
    }
    const DefaultSetting = () => {
        return (
            <>
                <div className='w-full flex flex-col lg:flex-row justify-start items-center gap-4 relative'>
                    <Avatar
                        size={'lg'}
                        img={currentUser?.photoURL}
                        rounded
                        bordered
                    />
                    <div className="flex items-center lg:items-start flex-col space-y-1">
                        <span className='font-medium text-xl'>{currentUser?.firstName} {currentUser?.lastName}</span>
                        <span className='font-normal text-base'>{currentUser?.phoneNumber} </span>
                        <span className='font-normal text-base text-[#5c5c5c] hover:underline cursor-pointer' onClick={copyUserName}>@{currentUser?.userName}</span>
                    </div>
                    <div className='absolute right-7 -top-0.5 flex gap-1'>
                        <Dropdown
                            label={
                                <BiDotsVerticalRounded className='text-gray-400 w-5 h-5' />
                            }
                            inline
                            className='backdrop-blur-sm bg-transparent border-none f-dropdown'
                        >
                            <Dropdown.Item className="text-[#374151] focus-within:border-none focus-visible:outline-none focus-visible:border-none p-2.5 rounded-md  w-full hover:!bg-[#f1f0f0] whitespace-nowrap flex items-center gap-2  !shadow-md transition-all duration-200 select-none" onClick={logOut}>
                                <FiLogOut size={20} /> <span>Log Out</span>
                            </Dropdown.Item>
                        </Dropdown>

                    </div>

                </div>
                <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
                <nav>
                    <ul className='space-y-2'>
                        <li onClick={() => setSettingState(prev => ({ ...prev, edit_profile: true }))}>
                            <button className=" p-2.5 rounded-md  w-full hover:!bg-[#f1f0f0] whitespace-nowrap flex items-center gap-2 text-[#374151] transition-all duration-200 select-none">
                                <BiSolidUser size={20} color='#ED9F20' /> Edit Profile
                            </button>
                        </li>
                        <li onClick={() => setSettingState(prev => ({ ...prev, edit_chat: true }))}>
                            <button className=" p-2.5 rounded-md  w-full hover:!bg-[#f1f0f0] whitespace-nowrap flex items-center gap-2 text-[#374151] transition-all duration-200 select-none">
                                <BsFillChatFill size={20} color='#7F56DA' /> Chat Settings
                            </button>
                        </li>
                        <li>
                            <button className=" p-2.5 rounded-md  w-full hover:!bg-[#f1f0f0] whitespace-nowrap flex items-center gap-2 text-[#374151] transition-all duration-200 select-none">
                                <MdLanguage size={20} color='#56B3F5' /> Language
                            </button>
                        </li>
                    </ul>
                </nav>
            </>
        )
    }
    return (
        <>
            {showToast && <HandleToast status={'green'} text={'link copied to clipboard'} />}
            <Modal className='backdrop-blur-sm' size={'2xl'} show={sidebarState?.setting}>
                <Modal.Body>
                    <div className='w-full h-full  relative'>
                        <button onClick={closeModal} type="button" className="bg-white z-10 rounded-md absolute -right-2 -top-2 p-1.5 inline-flex items-center justify-center text-gray-400 hover:text-[#111827] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                            <span className="sr-only">Close menu</span>
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        {
                            settingState.edit_profile ?
                                <EditProfile setSettingState={setSettingState} />
                                :
                                settingState.edit_chat ? <ChatSetting setSettingState={setSettingState} />
                                    :
                                    <DefaultSetting />
                        }
                    </div>
                </Modal.Body>

            </Modal >
        </>

    )
}

export default Settings
