import { collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../../DataBase/Firebase.Config';
import UserCard from './UserCard';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from 'flowbite-react';
import SearchedUserCard from './SearchedUserCard';
import { setChatState } from '../../redux/reducers/chatReducer';
import { setSearchState } from '../../redux/reducers/searchReducer';
const Users = () => {
    const [chats, setChats] = useState(null)
    const search = useSelector((state) => state.search)
    const currentUser = useSelector((state) => state.user.user);
    const chat = useSelector((state) => state.chat);
    const [usersData, setUsersData] = useState([])
    const [loadingAddContact, setLoadingAddContact] = useState(false)
    const dispatch = useDispatch()
    useEffect(() => {
        const getChats = () => {
            const unsub = onSnapshot(doc(db, "userChats", currentUser?.uid), async (doc) => {
                setChats(doc.data())
                doc.data() && Object.entries(doc.data()).map(item => {
                    getUserFullInformation(item[1]?.userInfo?.uid)
                })
            });
            return () => {
                unsub();
            };
        };

        currentUser?.uid && getChats();
    }, [currentUser?.uid]);

    const handleAddContact = async (user) => {
        if (user.uid == currentUser.uid) {
            return
        }
        setLoadingAddContact(true)
        const combinedId =
            currentUser.uid > user.uid
                ? currentUser.uid + user.uid
                : user.uid + currentUser.uid;
        try {
            const res = await getDoc(doc(db, "chats", combinedId))
            if (!res.exists()) {
                //create a chat in chats collection
                await setDoc(doc(db, "chats", combinedId), { messages: [] });
                //create user chats
                await updateDoc(doc(db, "userChats", currentUser.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: user.uid,
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });
                await updateDoc(doc(db, "userChats", user.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: currentUser.uid,
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });
                dispatch(setSearchState({ ...search, has: true }))
                setLoadingAddContact(false)
            } else {

            }
        } catch (err) { }
    }
    const handleSelect = (user) => {
        if (user) {
            const combinedId =
                currentUser.uid > user?.uid
                    ? currentUser.uid + user?.uid
                    : user?.uid + currentUser?.uid;
            dispatch(setChatState({ ...chat, user, chat_id: combinedId }))
        }
    }
    const getUserFullInformation = async (uid) => {
        if (uid) {
            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const exists = usersData.some(existingData => existingData?.uid === docSnap.data()?.uid);
                if (!exists) {
                    setUsersData(prevData => [...prevData, docSnap.data()]);
                }
            } else {
                console.log("No such document!");
            }
        }
    }
    const showSeachedUserInfo = () => {
        dispatch(setChatState({ ...chat, profile_info: { show: true, user: search?.user } }))
    }
    const showMobileInfo = () => {
        dispatch(setChatState({ ...chat, mobileProfile_info: { show: true, user: search?.user } }))
    }
    return (
        <div className=" mt-3">
            <div className='overflow-y-auto-users px-3'>
                {/* saerched user */}
                {
                    search.status && search.loading && search.user == null ? <Spinner /> :
                        search.status && !search.loading && search.user != null ?
                            <SearchedUserCard
                                showInfo={showSeachedUserInfo}
                                showMobileInfo={showMobileInfo}
                                openChat={() => handleSelect(search?.user)}
                                handleAddContact={() => handleAddContact(search.user)}
                                avatar={search.user.photoURL}
                                fullName={search?.user?.firstName + " " + search?.user?.lastName}
                                username={search?.user?.userName}
                                has={search.has}
                                loading={loadingAddContact}
                            />
                            :
                            !search.loading && search.user == null && search.status && 'not Found'
                }
                {/* chat users */}
                {
                    !search.status && !search.loading && search.user === null &&
                    <>
                        {
                            chats && Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date)?.map((item, index) => <UserCard
                                id={item[1]?.userInfo?.uid}
                                onClick={() => handleSelect(usersData.find(user => user?.uid === item[1]?.userInfo?.uid))}
                                avatar={usersData.find(user => user?.uid === item[1]?.userInfo?.uid)?.photoURL}
                                fullName={usersData.find(user => user?.uid === item[1]?.userInfo?.uid)?.firstName && (usersData.find(user => user?.uid === item[1]?.userInfo?.uid)?.firstName + " " + usersData.find(user => user?.uid === item[1]?.userInfo?.uid)?.lastName)}
                                lastText={item[1]?.lastMessage?.messageInput}
                                lastTime={item[1]?.lastTime}
                                key={item[0]} />)
                        }

                    </>
                }
            </div>

        </div >
    );
}

export default Users;
