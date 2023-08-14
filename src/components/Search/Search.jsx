import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import React, { useState } from 'react';
import { db } from '../../DataBase/Firebase.Config';
import { CiSearch } from 'react-icons/ci'
import { useDispatch, useSelector } from 'react-redux';
import { useRef } from 'react';
import { useEffect } from 'react';
import { setSearchState } from "../../redux/reducers/searchReducer";
const Search = () => {
    const [search, setSearch] = useState('')
    const searchState = useSelector((state) => state.search)
    const currentUser = useSelector((state) => state.user.user)
    const dispatch = useDispatch();
    const searchRef = useRef(null);
    // seaching 
    const searching = (value) => {
        let newValue = value.startsWith("@") ? value.replace("@", "") : value;
        const ref = collection(db, "users");
        let q = query(ref, where("userName", "==", newValue));
        getDocs(q).then(async (res) => {
            let user = res.docs.map(item => (item.data()))
            if (res.empty) {
                dispatch(setSearchState({ ...searchState, loading: false, status: true }))
            } else {
                const has = await searchFromContacts(user[0]);
                console.log(has);
                dispatch(setSearchState({ ...searchState, loading: false, user: user[0], has }))
            }
        });
    }
    useEffect(() => {
        if (!searchState.status && searchState.user === null && !searchState.loading) {
            setSearch("")
        }
    }, [searchState?.status])
    const handleSearch = (event) => {
        clearTimeout(searchRef.current);
        dispatch(setSearchState({ ...searchState, loading: true, status: true }))
        const value = event.target.value.toLowerCase();;
        setSearch(value);
        searchRef.current = setTimeout(async () => {
            searching(value);
        }, 2000);
    };
    const handleKeyDown = event => {
        if (event.key === 'Backspace') {
            dispatch(setSearchState({ ...searchState, user: null }))
        }
    };
    const searchFromContacts = async (user) => {
        const docRef = doc(db, "userChats", currentUser.uid)
        const docSnap = await getDoc(docRef);
        let has = Object.entries(docSnap.data()).some(item => {
            return item[1].userInfo.uid === user.uid;
        });
        return has;
    }
    return (
        <>
            <div className='flex items-center bg-white pr-2 h-9 rounded mt-2 border-full justify-between  w-full'>
                <input onPaste={handleSearch} onKeyDown={handleKeyDown} onChange={handleSearch} value={search} type="text" placeholder='Search users' className='w-full outline-none border-none  text-[15px] bg-transparent' />
                <CiSearch size={21} color='#AAAAAA' />
            </div>
        </>
    );
}

export default Search;
