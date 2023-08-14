import { Label, Spinner } from 'flowbite-react';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setChatState } from "../../redux/reducers/chatReducer";
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';

function ProfileInfo() {
    const chat = useSelector((state) => state.chat);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = (chat.profile_info.user && chat.profile_info.user) || (chat.mobileProfile_info.user && chat.mobileProfile_info.user)
    const closeProfileInfo = () => {
        dispatch(setChatState({ ...chat, profile_info: { show: false, user: null }, mobileProfile_info: { show: false, user: null } }))
    }
    const navigateToPhotoViewer = (url) => {
        dispatch(setChatState({ ...chat, photo_id: url, mobileProfile_info: { show: false, user: null } }))
        navigate("/home/photo_viewer")
    }
    return (
        <div className={`!min-w-[320px] !max-w-[320px] ${chat?.profile_info?.show || chat?.mobileProfile_info?.show ? 'block' : 'hidden'} `}>
            <div className='flex w-full  !relative border-bottom py-3 px-2 h-[53px] items-center justify-between bg-color' >
                <span className='text-[#3A405A] text-lg'>Profile info</span>
                <button onClick={closeProfileInfo} type="button" className="bg-white z-10 rounded-md  absolute right-2 p-1.5 inline-flex items-center justify-center text-gray-400 hover:text-[#111827] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                    <span className="sr-only">Close menu</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div >
            <div className="w-full p-1 overflow-y-auto" style={{ height: 'calc(100vh - 53px)' }}>
                {
                    user?.photoURL ?
                        <img onClick={() => navigateToPhotoViewer(user?.photoURL)} src={user?.photoURL} className='h-[320px] cursor-pointer w-full object-cover' />
                        :
                        <Spinner />
                }
                <div className="mb-2 mt-2 block ml-2">
                    <Label
                        htmlFor="fullname"
                        value="Bio"
                    />
                </div>
                <div className='p-2 border rounded-lg break-all bg-gray-50 min-h-[44px] cursor-pointer text-[15px] hover:bg-gray-100'>
                    {user && (user?.bio)}
                </div>
                <div className="mb-2 mt-2 block ml-2">
                    <Label
                        htmlFor="fullname"
                        value="Full name"
                    />
                </div>
                <div className='p-2 border rounded-lg break-all bg-gray-50  cursor-pointer text-[15px] hover:bg-gray-100'>
                    {user && (user?.firstName + " " + user?.lastName)}
                </div>
                <div className="mb-2 mt-2 block ml-2">
                    <Label
                        value="Username"
                    />
                </div>
                <div className='p-2 border rounded-lg break-all bg-gray-50  cursor-pointer text-[15px] hover:bg-gray-100'>
                    {user && (user?.userName)}
                </div>
                <div className="mb-2 mt-2 block ml-2">
                    <Label
                        htmlFor='phoneNumber'
                        value="Phone number"
                    />
                </div>
                <PhoneInput
                    id="phoneNumber"
                    className={"!w-full"}
                    country={'uz'}
                    disableDropdown={true}
                    disabled
                    value={user?.phoneNumber}
                />
            </div>
        </div >
    )
}

export default ProfileInfo
