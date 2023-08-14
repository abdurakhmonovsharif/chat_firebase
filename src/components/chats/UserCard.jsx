import { Avatar } from 'flowbite-react'
import React from 'react'
import { useSelector } from 'react-redux';
function UserCard({ onClick, avatar, fullName, lastText, lastTime, id }) {
    const chat = useSelector((state) => state.chat);
    return (
        <div onClick={onClick}
            className={` ${chat.user?.uid === id ? 'bg-[#7F56DA] text-white' : 'bg-[#F8F9FB] text-gray-950'} p-4 border-full rounded-md mb-2  cursor-pointer user-card-hover transition duration-300`}>
            <div className="flex justify-start items-center w-full">
                <Avatar rounded img={avatar} alt="user avatar" size={'md'}
                    className='border-[3px] border-white rounded-[50%]' />
                <div style={{
                    width: 'calc(100% - 45px)'
                }}>
                    <div className="flex ml-3 items-center justify-between gap-2 w-full">
                        <span className="text-[15px] whitespace-nowrap text-ellipsis overflow-hidden">{fullName && fullName}</span>
                        <span className="text-[13px] whitespace-nowrap">{lastTime && lastTime}</span>
                    </div>
                    <div
                        className="text-ellipsis ml-3 text-sm overflow-hidden h-6 whitespace-nowrap">
                        {lastText}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserCard;