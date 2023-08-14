import { Modal } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ModalHeader } from 'flowbite-react/lib/esm/components/Modal/ModalHeader';
import { ModalBody } from 'flowbite-react/lib/esm/components/Modal/ModalBody';
import { SlSizeFullscreen } from 'react-icons/sl'
import { AiOutlineDownload } from 'react-icons/ai'
import { FiTrash } from 'react-icons/fi'
import { BsArrowLeft } from 'react-icons/bs'
import { setSideBarStates } from "../../redux/reducers/sidebarReducer";
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../DataBase/Firebase.Config';
function Pictures() {
    const sidebarState = useSelector((state) => state.sidebar)
    const currentUser = useSelector((state) => state.user.user)
    const dispatch = useDispatch();
    const [mouseMoveId, setMouseMoveId] = useState(null)
    const [picToFull, setPicToFull] = useState(null)
    const [pictures, setPictures] = useState({ data: [], loading: false })
    // get pictures
    useEffect(() => {
        if (sidebarState.pictures) {
            setPictures({ ...pictures, loading: true })
            const unSub = onSnapshot(doc(db, "userFiles", currentUser?.uid), (doc) => {
                if (doc.exists() && doc.data().pictures?.length >= 1) {
                    setPictures({ data: doc.data().pictures, loading: false })
                } else if (doc.exists() && doc.data().pictures?.length === 0) {
                    setPictures({ data: [], loading: false })
                }
            });
            return () => {
                unSub();
            }
        }
    }, [sidebarState.pictures, pictures.data])
    const closeModal = () => {
        dispatch(setSideBarStates({ ...sidebarState, pictures: false }))
    }
    // open to full size
    const openToFull = (id) => {
        setPicToFull(id)
    }
    // close to full size
    const closeFullImage = () => {
        setPicToFull(null)
    }
    // remove item 
    const removeItem = async (id) => {
        const washingtonRef = doc(db, "userFiles", currentUser?.uid);
        const updatedArray = pictures.data.filter(item => item.id !== id);
        await updateDoc(washingtonRef, {
            pictures: updatedArray
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
        <Modal className='backdrop-blur-sm' size={'4xl'} show={sidebarState?.pictures} onClose={closeModal}>
            <ModalHeader>
                {
                    picToFull ?
                        <button onClick={closeFullImage} type="button" className="bg-white z-10 rounded-md  p-1.5 inline-flex items-center justify-center text-gray-400 hover:text-[#111827] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                            <BsArrowLeft className="h-5 w-5" />
                        </button> :
                        'Pictures'
                }
            </ModalHeader>
            <ModalBody>
                <>
                    {
                        pictures.data.length === 0 && <span className='text-lg font-medium'>Empty</span>
                    }
                    {
                        picToFull ? pictures.data.map(item => {
                            if (item.id === picToFull) {
                                return (
                                    <div key={item.id} className='w-full h-full'>
                                        <img src={item.url} alt="...image" className='w-full h-full' />
                                    </div>
                                )
                            }
                        })
                            :
                            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3">
                                {
                                    pictures.data.map(item => <div key={item.id} className=' relative w-full border !shadow-lg rounded-lg' onMouseMove={() => setMouseMoveId(item.id)}
                                        onMouseOut={() => setMouseMoveId(null)}
                                    >
                                        {
                                            mouseMoveId === item.id &&
                                            <div className=' absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg  
                                    space-x-2 p-1.5 flex items-center 
                                    ease-in duration-500
                                    bg-gray-400'>
                                                <button onClick={() => openToFull(item.id)} className='text-white text-lg'>
                                                    <SlSizeFullscreen />
                                                </button>
                                                <button onClick={() => donwloadItem(item.url)} className='text-white text-2xl'>
                                                    <AiOutlineDownload />
                                                </button>
                                                <button onClick={() => removeItem(item.id)} className='text-red-500 text-lg'>
                                                    <FiTrash />
                                                </button>
                                            </div>
                                        }
                                        <img loading={'lazy'} src={item.url} className='w-full h-full shadow-lg rounded-lg object-contain' />
                                    </div>)
                                }
                            </div>
                    }

                </>
            </ModalBody>
        </Modal>
    )
}

export default Pictures
