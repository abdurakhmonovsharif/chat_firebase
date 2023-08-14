import React, { useRef, useState } from 'react'
import { Avatar, Label, Modal, TextInput, Textarea } from 'flowbite-react'
import { ModalBody } from 'flowbite-react/lib/esm/components/Modal/ModalBody';
import { ModalHeader } from 'flowbite-react/lib/esm/components/Modal/ModalHeader';
import { BsArrowLeft } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux';
import PhoneInput from 'react-phone-input-2';
import { IoIosCamera } from 'react-icons/io'
import { doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../DataBase/Firebase.Config';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { setUser } from '../../redux/reducers/userReducser';
function EditProfile({ setSettingState }) {
    const currentUser = useSelector((state) => state.user.user);
    const dispatch = useDispatch()
    const [editFullName, setEditFullName] = useState(false);
    const [uploadProgressImage, setUploadProgressImage] = useState(0)
    const bioRef = useRef(null)
    const usernameRef = useRef(null)
    const handleSave = async e => {
        e.preventDefault();
        const firstName = e.target.firstName.value;
        const lastName = e.target.lastName.value;
        const washingtonRef = doc(db, "users", currentUser?.uid)
        await updateDoc(washingtonRef, {
            firstName, lastName
        }).then(() => {
            dispatch(setUser({ ...currentUser, firstName, lastName }))
        })
        setEditFullName(false)
    };
    const closeEditProfile = () => {
        setSettingState(prev => ({ ...prev, edit_profile: false }))
    }
    // change profile image
    const changeProfileImage = async e => {
        const file = e.target.files[0];
        console.log(file);
        const storageRef = ref(storage, file?.name);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on("state_changed",
            (snapshot) => {
                const progress = Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 100)
                setUploadProgressImage(progress)
                if (file === null) return;
            },
            (error) => {
                // err
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    setUploadProgressImage(0)
                    const ref = doc(db, "users", currentUser?.uid);
                    await updateDoc(ref, {
                        photoURL: downloadURL
                    });
                    dispatch(setUser({ ...currentUser, photoURL: downloadURL }))
                });
            }
        );

    }
    // change user name
    const changeUserName = async (value) => {
        clearTimeout(usernameRef.current);
        usernameRef.current = setTimeout(async () => {
            const washingtonRef = doc(db, "users", currentUser?.uid)
            await updateDoc(washingtonRef, {
                userName: value
            }).then(() => {
                dispatch(setUser({ ...currentUser, userName: value }))
            })
        }, 1000);
    }
    // change bio 
    const changeBio = (value) => {
        clearTimeout(bioRef.current);
        bioRef.current = setTimeout(async () => {
            const washingtonRef = doc(db, "users", currentUser?.uid)
            await updateDoc(washingtonRef, {
                bio: value
            }).then(() => {
                dispatch(setUser({ ...currentUser, bio: value }))
            })
        }, 1000);
    }
    return (
        <div className=' w-full p-2 relative'>
            <button onClick={closeEditProfile} type="button" className="bg-white z-10 rounded-md absolute -left-2 -top-2 p-1.5 inline-flex items-center justify-center text-gray-400 hover:text-[#111827] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                <BsArrowLeft size={20} className='font-bold' />
            </button>
            <div className='w-full flex  flex-col items-center justify-center'>
                <label htmlFor="file_input" className='cursor-pointer relative'>
                    <Avatar
                        size={'lg'}
                        img={currentUser?.photoURL}
                        rounded
                        bordered
                        className={`relative ${uploadProgressImage !== 0 && 'avatar-blur'}`}
                    >
                        <span className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-base text-white font-medium'>{uploadProgressImage != 0 && uploadProgressImage + "%"} </span>
                    </Avatar>
                    <IoIosCamera className='w-7 h-7 absolute bottom-0.5 right-2.5 text-[#7F56DA]' />
                </label>
                <input type="file" hidden id='file_input' onChange={changeProfileImage} />
                <div className="flex flex-col mt-2">
                    <span className='font-medium text-xl'>{currentUser && (currentUser?.firstName + " " + currentUser?.lastName)}</span>
                </div>
            </div>
            {/* user bio */}
            <div className="mb-2 block">
                <Label
                    htmlFor="large"
                    value="Bio (optional)"
                />
            </div>
            <Textarea
                id="large"
                type="text"
                maxLength={100}
                cols={1}
                defaultValue={currentUser?.bio}
                className='resize-none'
                onChange={(e) => changeBio(e.target.value)}
            />
            {/* user full name */}
            <div className="mb-2 mt-2 block">
                <Label
                    htmlFor="fullname"
                    value="Full name"
                />
            </div>
            <div onClick={() => setEditFullName(true)} className='p-2 border rounded-lg bg-gray-50  cursor-pointer text-[15px] hover:bg-gray-100'>
                {currentUser && (currentUser?.firstName + " " + currentUser?.lastName)}
            </div>
            {/* edit firstname and lastName */}
            <Modal className='backdrop-blur-sm' show={editFullName} onClose={() => setEditFullName(false)} size={'sm'}>
                <ModalHeader>Edit full name</ModalHeader>
                <ModalBody>
                    <form onSubmit={handleSave}>
                        <div className="mb-2 mt-2 block">
                            <Label
                                htmlFor="firstName"
                                value="First name"
                            />
                        </div>
                        <TextInput
                            id="firstName"
                            type="text"
                            name='firstName'
                            defaultValue={currentUser?.firstName}
                            className='resize-none'
                        />
                        <div className="mb-2 mt-2 block">
                            <Label
                                htmlFor="lastName"
                                value="Last name"
                            />
                        </div>
                        <TextInput
                            id="lastName"
                            type="text"
                            name="lastName"
                            defaultValue={currentUser?.lastName}
                            className='resize-none'
                        />
                        <div className='w-full flex justify-end items-center mt-4' type="submit">
                            <button className='hover:!bg-[#5d3da3] px-5 py-2 bg-[#7F56DA]  text-white rounded-md '>Save</button>
                        </div>
                    </form>

                </ModalBody>
            </Modal>


            {/* user username */}
            <div className="mb-2 mt-2 block">
                <Label
                    htmlFor="username"
                    value="Username"
                />
            </div>
            <TextInput
                id="username"
                type="text"
                addon="@"
                name='username'
                onChange={(e) => changeUserName(e.target.value)}
                defaultValue={currentUser?.userName}
            />

            {/* user phoneNumber */}
            <div className="mb-2 mt-2 block">
                <Label
                    htmlFor="phoneNumber"
                    value="Phone number"
                />
            </div>
            <PhoneInput
                id="phoneNumber"
                className={"!w-full"}
                country={'uz'}
                disableDropdown={true}
                disabled
                value={currentUser?.phoneNumber}
            />
        </div>
    )
}

export default EditProfile
