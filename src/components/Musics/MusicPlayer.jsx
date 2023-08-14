import React from 'react'
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
function MusicPlayer({ music, setOpenMusic }) {
    const close = () => {
        setOpenMusic({ show: false, music: null })
    }
    return (
        <>
            {
                music &&
                <AudioPlayer
                    src={music.url}
                    autoPlay
                    header={<div className='w-full items-center flex justify-between'>
                        <span>{music.name} - {music.artist}</span>
                        <button onClick={close} type="button" className="bg-white z-10 rounded-md p-1.5 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                            <span className="sr-only">Close menu</span>
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>}
                />
            }
        </>

    )
}

export default MusicPlayer
