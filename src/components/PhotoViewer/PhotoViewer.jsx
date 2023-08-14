import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setChatState } from '../../redux/reducers/chatReducer';
import { useNavigate } from 'react-router-dom';
function PhotoViewer() {
    const chat = useSelector((state) => state.chat);
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const closeViwer = () => {
        dispatch(setChatState({ ...chat, photo_id: null }))
        navigate('/home')
    }
    return (
        <div className='fixed inset-0 backdrop-blur-sm grid  backdrop-brightness-50 z-10 object-contain'>
            <button onClick={closeViwer} type="button" className="bg-white z-[11] !cursor-pointer rounded-md absolute right-2 top-2 p-1.5 inline-flex items-center justify-center text-gray-400 hover:text-[#111827] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                <span className="sr-only">Close menu</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <img src={chat?.photo_id} alt="" className='mx-auto my-auto max-h-screen p-2 !rounded-lg' />
        </div>
    )
}

export default PhotoViewer
