import React, { useEffect, useState } from 'react';
import { db } from '../DataBase/Firebase.Config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/reducers/userReducser';
import { setChatState } from '../redux/reducers/chatReducer';
import Side from "../components/Sider/Sider";
import Chat from "../components/chats/Chat";
import ProfileInfo from "../components/ProfileInfo/ProfileInfo";
import { Outlet, useNavigate } from 'react-router-dom';
import Drawer from 'react-modern-drawer'
export const ChangeUser = "CHANGE_USER";
export const CHANGE_FILE = "CHANGE_FILE";
const Home = () => {
    const navigate = useNavigate()
    // auth check
    const auth = localStorage.getItem("auth");
    useEffect(() => {
        if (auth && auth === "true") {
            // open 
        } else {
            navigate("/login")
        }
    }, [])

    const dispatch = useDispatch()
    const currentUser = useSelector((state) => state.user.user)
    const chat = useSelector((state) => state.chat)
    useEffect(() => {
        if (currentUser === null) {
            let checkLocalStorageWithUserUid = localStorage.getItem("_user-uid")
            let q = query(collection(db, "users"), where("uid", "==", checkLocalStorageWithUserUid))
            getDocs(q).then(res => {
                if (res?.empty) {
                    navigate("/login")
                    localStorage.removeItem("auth")
                    return
                }
                res.docs.map(item => {
                    dispatch(setUser(item.data()))
                })
            })
        }
        getChatImages()
    }, [])
    const getChatImages = async () => {
        let baseUrl = 'https://firebasestorage.googleapis.com/v0/b/telegram-26a2c.appspot.com/o';
        try {
            let url = localStorage.getItem("chat_bg_image")
            if (url) {
                const startIndex = url.indexOf('https');
                const endIndex = url.indexOf('/chat_images');
                let ref = collection(db, "chat_images")
                const data = await getDocs(ref);
                let array = data.docs.map(item => {
                    return ({ ...item.data(), id: item.id })
                })
                if (startIndex !== -1 && endIndex !== -1) {
                    const extractedString = url.substring(startIndex, endIndex);
                    if (extractedString !== baseUrl) {
                        dispatch(setChatState({ ...chat, bg_image: array[0].url }))
                        localStorage.setItem("chat_bg_image", array[0].url);
                    } else {
                        dispatch(setChatState({ ...chat, bg_image: url }))
                    }
                }
            }
        } catch (err) {
        }
    }
    const closeMobileProfileInfo = () => {
        dispatch(setChatState({ ...chat, mobileProfile_info: { show: false, user: null } }))
    }
    return (
        <div className='flex justify-between w-full'>
            <Side />
            <Chat />
            <Drawer
                open={chat.mobileProfile_info.show}
                onClose={closeMobileProfileInfo}
                direction='right'
                className='relative'
                size={320}
            >
                <ProfileInfo />
            </Drawer>
            <div className="hidden lg:block">
                <ProfileInfo />
            </div>
            <Outlet />
        </div>
    );
}
export default Home;
