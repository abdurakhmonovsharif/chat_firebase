import { Modal } from 'flowbite-react';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaPlay, FaPause } from 'react-icons/fa'
import { CiSearch } from 'react-icons/ci'
import { useRef } from 'react';
import { useState } from 'react';
import MusicPlayer from './MusicPlayer';
import { clearSideBarStates } from "../../redux/reducers/sidebarReducer";
import { setChatState } from "../../redux/reducers/chatReducer";
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../DataBase/Firebase.Config';
import { FiTrash } from 'react-icons/fi'
function Musics() {
    const sidebarState = useSelector((state) => state.sidebar);
    const chat = useSelector((state) => state.chat);
    const currentUser = useSelector((state) => state.user.user);
    const dispatch = useDispatch();
    const audioRef = useRef(null);
    const [currentPlayingId, setCurrentPlayingId] = useState(null);
    const [openMusic, setOpenMusic] = useState({ show: false, music: null });
    const [searchValue, setSearchValue] = useState('');
    const [searchedArray, setSearchedArray] = useState([]);
    const isPlaying = (id) => id === currentPlayingId;
    const [musics, setMusics] = useState({ data: [], loading: false });
    // get musics
    useEffect(() => {
        if (sidebarState.musics) {
            setMusics({ ...musics, loading: true })
            const unSub = onSnapshot(doc(db, "userFiles", currentUser?.uid), (doc) => {
                if (doc.exists() && doc.data().musics?.length >= 1) {
                    setMusics({ data: doc.data().musics, loading: false })
                } else if (doc.exists() && doc.data().musics?.length === 0) {
                    setMusics({ data: [], loading: false })
                }
            });
            return () => {
                unSub();
            }
        }
    }, [sidebarState.musics])
    const closeModal = () => {
        dispatch(clearSideBarStates())
        setCurrentPlayingId(null)
        document.title = 'Chat'
    }
    const playMusic = (id, url, name, artist) => {
        if (audioRef.current) {
            audioRef.current.src = url;
            document.title = name + "-" + artist
            audioRef.current.play();
            setCurrentPlayingId(id);
        }
    };

    const pauseMusic = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setCurrentPlayingId(null);
        }
    };
    const openMusicToPlayer = (music) => {
        dispatch(setChatState({ ...chat, music }))
        setOpenMusic({ show: true, music })
        setCurrentPlayingId(null);
    }
    const handleSearching = value => {
        setSearchValue(value);
        if (value !== "") {
            const searched = musics.data.filter(item => item.name.toLocaleLowerCase().includes(value.toLocaleLowerCase()));
            setSearchedArray(searched);
        }
    }
    const removeItem = async (id) => {
        const washingtonRef = doc(db, "userFiles", currentUser?.uid);
        const updatedArray = musics.data.filter(item => item.id !== id);
        await updateDoc(washingtonRef, {
            musics: updatedArray
        })
    }
    return (
        <>
            <Modal className='backdrop-blur-sm' size={'xl'} show={sidebarState?.musics} onClose={closeModal}>
                {
                    !openMusic.music &&
                    <Modal.Header>
                        <div className='w-full h-full flex lg:flex-row flex-col justify-center lg:justify-between lg:items-center lg:gap-3'>
                            <span>Musics</span>
                            <div className='flex items-center bg-white pr-2 h-9 rounded mt-2 border-full justify-between !w-full'>
                                <input onChange={(e) => handleSearching(e.target.value)} value={searchValue} type="text" placeholder='Search music' className='w-full outline-none border-none  text-[15px] bg-transparent' />
                                <CiSearch size={21} color='#AAAAAA' />
                            </div>
                        </div>
                    </Modal.Header>
                }
                <Modal.Body>
                    {
                        musics.data.length===0&&<span className='font-semibold text-lg'>Empty</span>
                    }
                    {
                        openMusic.show ? <MusicPlayer music={openMusic.music} setOpenMusic={setOpenMusic} /> :
                            <div className='w-full h-full relative'>
                                <ul className='space-y-3'>
                                    {(searchValue !== "" ? searchedArray : musics.data).map((item) => (
                                        <li
                                            key={item.id}
                                            className='flex gap-3 items-center cursor-pointer justify-between  p-2.5 rounded-lg'
                                        >
                                            {isPlaying(item.id) ? (
                                                <FaPause size={20} onClick={pauseMusic} />
                                            ) : (
                                                <FaPlay size={20} onClick={() => playMusic(item.id, item.url, item.name)} />
                                            )}
                                            <div className='space-x-3 items-center text-start w-full flex justify-between cursor-pointer'
                                                onClick={() => openMusicToPlayer(item)}
                                            >
                                                <div className='space-x-2'>
                                                    <span className='font-semibold text-base'>{item.name}</span>
                                                </div>
                                                <audio controls hidden ref={audioRef} />
                                                <button className='bg-[#7F56DA] text-white rounded-lg py-1.5 hover:!bg-[#5d3da3] px-3'>Player</button>

                                            </div>
                                            <button onClick={() => removeItem(item.id)} className='text-red-500 text-lg'>
                                                <FiTrash />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                    }
                </Modal.Body>
            </Modal >
        </>
    )
}

export default Musics
