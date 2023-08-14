import React, { Suspense, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    collection,
    getDocs,
    onSnapshot,
    query,
    where,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    serverTimestamp
} from 'firebase/firestore'
import { db } from '../../DataBase/Firebase.Config';
import Search from '../Search/Search';
import { LuMenu } from 'react-icons/lu'
import { FiMusic, FiVideo, FiUser, FiSettings, FiLogOut, FiImage, FiArrowLeft } from 'react-icons/fi'
import { BiDotsVerticalRounded } from 'react-icons/bi'
import Drawer from 'react-modern-drawer'
import { Avatar, Dropdown } from 'flowbite-react';
import { HandleToast, copyToClipBoard } from '../../Helpers/Helpler';
import Users from '../chats/Users';
import { useDispatch, useSelector } from 'react-redux';
import { clearSideBarStates, setSideBarStates } from "../../redux/reducers/sidebarReducer";
import { clearSearchState } from "../../redux/reducers/searchReducer";
import Musics from "../Musics/Musics";
import Pictures from "../Pictures/Pictures";
import Settings from "../Settings/Settings";
import Videos from "../Videos/Videos";
import { clearChatState } from '../../redux/reducers/chatReducer';
import { clearUser } from '../../redux/reducers/userReducser';
const Sider = () => {
    const [userInfo, setUserInfo] = useState({})
    const [sideDisplay, setSideDisplay] = useState(false)
    const [usernameIsClick, setUsernameIsClick] = useState(false)
    const navigate = useNavigate()
    const searchStateStatus = useSelector((state) => state.search.status)
    const sidebarState = useSelector((state) => state.sidebar)
    const chat = useSelector((state) => state.chat)
    const dispatch = useDispatch()
    useEffect(() => {
        getUser()
    }, [sideDisplay])
    // Get user infomation
    const getUser = async () => {
        try {
            let uid = localStorage.getItem("_user-uid")
            let ref = collection(db, "users")
            let q = query(ref, where("uid", "==", uid))
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setUserInfo(doc.data());
            })
        } catch (err) {
        }
    }
    const logOut = () => {
        navigate("/login");
        localStorage.removeItem("auth")
        dispatch(clearSideBarStates())
        dispatch(clearSearchState())
        dispatch(clearChatState())
        dispatch(clearUser())
    }
    const copyUserName = () => {
        const success = copyToClipBoard(userInfo?.userName);
        if (success) {
            setUsernameIsClick(!usernameIsClick)
        }
    }
    const showSetting = () => {
        dispatch(setSideBarStates({ ...sidebarState, setting: true }));
        setSideDisplay(false);
    }
    const showMusics = () => {
        dispatch(setSideBarStates({ ...sidebarState, musics: true }))
        setSideDisplay(false);
    }
    const showVideos = () => {
        dispatch(setSideBarStates({ ...sidebarState, videos: true }))
        setSideDisplay(false);
    }
    const showPictures = () => {
        dispatch(setSideBarStates({ ...sidebarState, pictures: true }))
        setSideDisplay(false);
    }
    return (
        <>
            {
                usernameIsClick &&
                < HandleToast status={'green'} text={'link copied to clipboard'} />
            }
            <div className={`bg-color border-rigth h-screen lg:max-w-[360px] sm:w-full md:w-full md:max-w-none ${chat.chat_id ? 'hidden lg:block' : ''}`}>
                <div className="block">
                    <div className="flex items-center gap-2 px-3 py-2 ">
                        {
                            searchStateStatus ?
                                <button onClick={() => dispatch(clearSearchState())}>
                                    <FiArrowLeft size={25} className='text-[#AAAAAA] mt-1.5 cursor-pointer' />
                                </button> :
                                <button onClick={() => setSideDisplay(true)}>
                                    <LuMenu className='text-[#AAAAAA] mt-1 cursor-pointer' size={25} />
                                </button>
                        }
                        <Search />
                    </div>
                    <Users />
                </div>
            </div>
            <Drawer
                open={sideDisplay}
                onClose={() => setSideDisplay(false)}
                direction='left'
                className='p-2.5 backdrop-blur-md !bg-transparent relative'
                size={290}
            >
                <div className='flex justify-center flex-col items-center text-center relative'>
                    <Avatar
                        rounded={true}
                        bordered
                        img={userInfo.photoURL}
                        size={'lg'}
                        title={userInfo?.firstName + " " + userInfo?.lastName}
                    />
                    <div className="mt-2 font-normal text-white">
                        {userInfo?.firstName} {userInfo?.lastName}
                    </div>
                    <div className='w-fit hover:underline font-medium text-sm mt-0.5 cursor-pointer  text-white'
                        onClick={copyUserName}>
                        @{userInfo?.userName}
                    </div>
                    <div className='absolute right-2 top-2'>
                        <Dropdown
                            label={
                                <BiDotsVerticalRounded size={20} color='#FFF' />
                            }
                            inline
                            className='backdrop-blur-sm bg-transparent border-none f-dropdown '
                        >
                            <Dropdown.Item
                                className="bg-[#7F56DA]  focus-within:border-none focus-visible:outline-none focus-visible:border-none p-2.5 rounded-md  w-full hover:!bg-[#5d3da3] whitespace-nowrap flex items-center gap-2 text-white transition-all duration-200 select-none"
                                onClick={logOut}>
                                <FiLogOut size={20} /> <span>Log Out</span>
                            </Dropdown.Item>
                        </Dropdown>
                    </div>
                </div>
                <nav className='mt-7 flex flex-col justify-between overflow-y-auto h-auto'>
                    <ul className='space-y-2 overflow-y-auto flex-grow mt-auto'>
                        <li onClick={showMusics}>
                            <button
                                className="bg-[#7F56DA] p-2.5 rounded-md  w-full hover:!bg-[#5d3da3] whitespace-nowrap flex items-center gap-2 text-white transition-all duration-200 select-none">
                                <FiMusic size={20} /> <span>Musics</span>
                            </button>
                        </li>
                        <li onClick={showVideos}>
                            <button
                                className="bg-[#7F56DA] p-2.5 rounded-md  w-full hover:!bg-[#5d3da3] whitespace-nowrap flex items-center gap-2 text-white transition-all duration-200 select-none">
                                <FiVideo size={20} /> <span>Videos</span>
                            </button>
                        </li>
                        <li onClick={showPictures}>
                            <button
                                className="bg-[#7F56DA] p-2.5 rounded-md  w-full hover:!bg-[#5d3da3] whitespace-nowrap flex items-center gap-2 text-white transition-all duration-200 select-none">
                                <FiImage size={20} /> <span>Pictures</span>
                            </button>
                        </li>

                        <li onClick={showSetting}>
                            <button
                                className="bg-[#7F56DA] p-2.5 rounded-md  w-full hover:!bg-[#5d3da3] whitespace-nowrap flex items-center gap-2 text-white transition-all duration-200 select-none">
                                <FiSettings size={20} /> <span>Settings</span>
                            </button>
                        </li>
                    </ul>
                </nav>
            </Drawer>
            <Settings />
            <Musics />
            <Videos />
            <Pictures />
        </>
    );
}

export default Sider;
