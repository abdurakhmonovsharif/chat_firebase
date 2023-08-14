import { Modal, Spinner } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSideBarStates } from '../../redux/reducers/sidebarReducer'
import { ModalBody } from 'flowbite-react/lib/esm/components/Modal/ModalBody'
import { ModalHeader } from 'flowbite-react/lib/esm/components/Modal/ModalHeader'
import { useRef } from 'react'
import { Player } from 'video-react'
import { AiOutlineDownload } from 'react-icons/ai'
import { FiTrash } from 'react-icons/fi'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../DataBase/Firebase.Config'
function Videos() {
    const sidebarState = useSelector((state) => state.sidebar)
    const currentUser = useSelector((state) => state.user.user)
    const dispatch = useDispatch()
    const videoRefs = useRef([]);
    const [videos, setVideos] = useState({ data: [], loading: false })
    // get musics
    useEffect(() => {
        if (sidebarState.videos) {
            setVideos({ ...videos, loading: true })
            const unSub = onSnapshot(doc(db, "userFiles", currentUser?.uid), (doc) => {
                if (doc.exists() && doc.data().videos?.length >= 1) {
                    setVideos({ data: doc.data().videos, loading: false })
                } else if (doc.exists() && doc.data().videos?.length === 0) {
                    setVideos({ data: [], loading: false })
                }
            });
            return () => {
                unSub();
            }
        }
    }, [sidebarState.videos])
    const closeModal = () => {
        dispatch(setSideBarStates({ ...sidebarState, videos: false }))
    }
    const removeItem = async (id) => {
        const washingtonRef = doc(db, "userFiles", currentUser?.uid);
        const updatedArray = videos.data.filter(item => item.id !== id);
        await updateDoc(washingtonRef, {
            videos: updatedArray
        })
    }
    // donwloadItem
    const donwloadItem = (url) => {
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = url;
        anchor.target = '_blank';
        anchor.style.display = 'none';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    }
    return (
        <Modal className='backdrop-blur-sm' size={'5xl'} show={sidebarState?.videos} onClose={closeModal}>
            <ModalHeader>
                Videos
            </ModalHeader>
            <ModalBody>
                <div className="w-full h-full">
                    {
                        videos.data.length === 0 && <span className='font-semibold text-lg'>Empty</span>
                    }
                    {
                        videos.loading ? <Spinner size={'xl'} /> :
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-2.5 items-center">
                                {
                                    videos.data.map(item => {
                                        return (
                                            <div className="relative h-full w-full flex items-center" key={item.id}>
                                                <Player ref={videoRefs} src={item.url} />
                                                <div className=' absolute top-2 right-1  rounded-lg  
                                    space-x-2 p-1.5 flex items-center 
                                    ease-in duration-500
                                    bg-gray-400'>
                                                    <button onClick={() => donwloadItem(item.url)} className='text-white text-2xl'>
                                                        <AiOutlineDownload />
                                                    </button>
                                                    <button onClick={() => removeItem(item.id)} className='text-red-500 text-lg'>
                                                        <FiTrash />
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                    }
                </div>

            </ModalBody>
        </Modal>
    )
}

export default Videos
