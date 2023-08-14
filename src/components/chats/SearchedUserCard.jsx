import { Avatar, Spinner } from 'flowbite-react'
import React from 'react'
import { FaUserPlus } from 'react-icons/fa'
import { HiCheck, HiOutlineInformationCircle, HiChatAlt2 } from 'react-icons/hi'
import { clearSearchState } from '../../redux/reducers/searchReducer'
import { useDispatch } from 'react-redux'
function SearchedUserCard({ showInfo, handleAddContact, avatar, fullName, username, has, loading, showMobileInfo, openChat }) {
    const dispatch = useDispatch()
    const handleOpenChat = () => {
        openChat()
        dispatch(clearSearchState())
    }
    return (
        <div className="p-3.5 border-full rounded-md mb-2 bg-[#F8F9FB]">
            <div className="flex justify-start items-center w-full">
                <Avatar rounded img={avatar} alt="user avatar" size={'md'} />
                <div style={{
                    width: 'calc(100% - 45px)'
                }}>
                    <div className="flex ml-3 h-full items-center justify-between gap-2 w-full">
                        <span className="text-[15px] whitespace-nowrap">{fullName}</span>
                        {
                            has ?
                                <div className="block relative ">
                                    <div className="flex gap-0.5">
                                        <button onClick={handleAddContact} className="text-xl text-green-500">
                                            <HiCheck className="h-5 w-5" />
                                        </button>
                                        <button className="text-xl whitespace-nowrap text-end flex space-x-2 text-green-500">
                                            {/* open mobile profile info */}
                                            <HiOutlineInformationCircle className="h-5 w-5 lg:hidden block" onClick={showMobileInfo} />
                                            {/* open profile info */}
                                            <HiOutlineInformationCircle className="h-5 w-5 lg:block hidden" onClick={showInfo} />
                                        </button>
                                    </div>
                                    <button className='absolute mt-1 ml-3 text-green-500' onClick={handleOpenChat}>
                                        <HiChatAlt2 className='w-5 h-5' />
                                    </button>
                                </div>
                                :
                                <div className="flex gap-3">
                                    <button onClick={handleAddContact} className="text-xl text-[#969696] ">
                                        {
                                            loading ? <Spinner className='w-5 h-5' /> :
                                                <FaUserPlus className="h-5 w-5" />
                                        }
                                    </button>
                                    <button onClick={showInfo} className="text-xl text-[#969696]">
                                        {/* open mobile profile info */}
                                        <HiOutlineInformationCircle className="h-5 w-5 lg:hidden block border border-red-500" onClick={showMobileInfo} />
                                        {/* open profile info */}
                                        <HiOutlineInformationCircle className="h-5 w-5 lg:block hidden" onClick={showInfo} />
                                    </button>
                                </div>
                        }
                    </div>
                    <div
                        className="text-ellipsis ml-3 text-sm overflow-hidden h-6 whitespace-nowrap">
                        {username}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchedUserCard;