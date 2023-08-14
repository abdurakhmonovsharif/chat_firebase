import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db, dbAuth, storage } from '../../DataBase/Firebase.Config';
import { Avatar, Label, Spinner, TextInput } from 'flowbite-react';
const Register = () => {
    const navigate = useNavigate()
    const [selectPhoto, setSelectPhoto] = useState('')
    const [photo, setPhoto] = useState('')
    const [loading, setLoading] = useState(false)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [username, setUserName] = useState('')
    const [err, setErr] = useState('')
    const [usernameUnique, setUsernameUnique] = useState(false)
    function fileToBase64(file) {
        setPhoto(file)
        let render = new FileReader()
        render.readAsDataURL(file)
        render.onload = () => {
            setSelectPhoto(render.result)
        }
    }
    const handleSignUp = async (e) => {
        setLoading(true)
        e.preventDefault()
        const usernameUniqueStatus = ((await checkUserName()));
        const storageRef = ref(storage, `${dbAuth.currentUser.phoneNumber}/${photo.name}`);
        try {
            if (usernameUniqueStatus) {
                await uploadBytesResumable(storageRef, photo).then(() => {
                    getDownloadURL(storageRef).then(async (downloadURL) => {
                        try {
                            // Create user on firestore  
                            await setDoc(doc(db, "users", dbAuth.currentUser.uid), {
                                uid: dbAuth.currentUser.uid,
                                firstName: firstName,
                                lastName: lastName,
                                phoneNumber: dbAuth.currentUser.phoneNumber,
                                photoURL: downloadURL,
                                userName: username,
                                bio: ""
                            });
                            // Create empty user chats on firestore
                            await setDoc(doc(db, "userChats", dbAuth?.currentUser?.uid), {});
                            await setDoc(doc(db, "userFiles", dbAuth?.currentUser?.uid), {
                                musics: [],
                                pictures: [],
                                videos: []
                            });
                            setLoading(false)
                            navigate("/home");
                            localStorage.setItem("auth", 'true')
                        } catch (err) {
                            setErr(err.message)
                        }
                    });
                });
            } else {
                setUsernameUnique(true)
                setLoading(false)
            }
        } catch (err) {
            setErr(err.message)
        }
    }
    const checkUserName = async () => {
        let ref = collection(db, "users")
        let q = query(ref, where("userName", "==", username))
        const querySnapshot = await getDocs(q);
        return querySnapshot.empty
    }
    return (
        <div className='w-full  flex items-center'>
            <div className=" w-full lg:w-[50%] h-screen !py-4  justify-center flex flex-col items-center ">
                <h2 className='text-4xl'>Welcome</h2>
                <span className='text-sm text-[#AAAAAA]'>Welcome! Please enter your details.</span>
                <form onSubmit={handleSignUp} className="flex mt-4 lg:w-[64%] w-full  p-4 lg:p-0 flex-col gap-4">
                    <label htmlFor="fileInput" className='cursor-pointer  h-[100px]  flex-col gap-2 flex justify-center items-center'>
                        <Avatar className='rounded-[50%] border' size={'lg'} rounded img={
                            selectPhoto ? selectPhoto :
                                "https://cdn.pixabay.com/photo/2016/01/03/00/43/upload-1118929_960_720.png"} >
                        </Avatar>
                        {
                            !selectPhoto &&
                            <span>Upload picture</span>
                        }
                        <input accept='.jpg,.jpeg,.png,.wepb' type="file" id='fileInput' hidden onChange={(e) => fileToBase64(e.target.files[0])} />
                    </label>
                    <div className=' lg:grid grid-rows-1 grid-cols-2 gap-2'>
                        <div className="mb-2 block">
                            <Label
                                htmlFor="firstName"
                                value="First name"
                            />
                            <TextInput
                                id="firstName"
                                placeholder="James"
                                required
                                name='firstName'
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className="mb-2 block">
                            <Label
                                htmlFor="lastName"
                                value="Last name"

                            />
                            <TextInput
                                id="lastName"
                                placeholder="Smith"
                                required
                                name='lastName'
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="mb-2 block">
                            <Label
                                htmlFor="Username"
                                value="Username"
                            />
                        </div>
                        <TextInput
                            id="Username"
                            required
                            minLength={8}
                            addon="@"
                            type="text"
                            name='Username'
                            value={username}
                            onChange={(e) => setUserName(e.target.value)}
                            helperText={<span className='text-red-500 mt-0.5 font-normal text-sm'>
                                {usernameUnique
                                    ?
                                    <>
                                        Oops!
                                        Username already taken!
                                    </> :
                                    ''
                                }
                            </span>}
                            placeholder='example1992'
                        />
                        {err && <span className="text-red-500 mt-0.5 font-normal text-sm">{err}</span>}
                    </div>
                    <button type="submit" className="bg-[#7F56DA] hover:!bg-[#5d3da3] px-3 py-[9px] rounded-lg text-white transition-all duration-400  font-medium">
                        {loading ?
                            <Spinner />
                            :
                            <>Sumbit</>
                        }
                    </button>
                </form>
            </div>
            <div className=" w-[50%] bg-[#F3F4F8] h-screen  items-center justify-center hidden lg:flex">
                <img className='w-[80%] mix-blend-darken h-auto' src="https://img.freepik.com/free-vector/chat-conversation-mobile-phone-screen-tiny-people-group-persons-chatting-messenger-flat-vector-illustration-social-media-community-concept-banner-website-design-landing-web-page_74855-21724.jpg" alt="" />
            </div>
        </div>
    );
}


export default Register;
