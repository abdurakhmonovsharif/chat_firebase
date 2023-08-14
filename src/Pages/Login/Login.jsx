import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { signInWithPhoneNumber } from 'firebase/auth';
import { db, dbAuth } from '../../DataBase/Firebase.Config';
import { RecaptchaVerifier } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Label, Spinner, TextInput } from 'flowbite-react';
import PhoneInput from 'react-phone-input-2';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/reducers/userReducser'
import { BsArrowLeft } from 'react-icons/bs'
const Login = () => {
    const navigate = useNavigate()
    const [number, setNumber] = useState("")
    const [code, setCode] = useState("")
    const [err, setErr] = useState("")
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const [loadingGetCode, setLoadingGetCode] = useState({ loading: false, success: false })
    // phoneVerification
    function handleSignIn(e) {
        e.preventDefault()
        setLoading(true)
        // //checkCode 
        window.confirmationResult && window.confirmationResult.confirm(code).then(async (result) => {
            //save to local for get infomation
            localStorage.setItem("_user-uid", result.user.uid)
            let uid = result.user.uid
            // check users
            try {
                let ref = collection(db, "users")
                let q = query(ref, where("uid", "==", uid))
                const querySnapshot = await getDocs(q);
                if (querySnapshot.empty) {
                    navigate('/register')
                    return
                }
                querySnapshot.forEach((doc) => {
                    dispatch(setUser(doc.data()))
                    localStorage.setItem("auth", 'true')
                    navigate("/home")
                })
            } catch (err) {
                setErr(err.message)
                setLoading(false)
            }
        }).catch(err => {
            setErr(err.message)
            setLoading(false)
        })
    }
    const sendCode = () => {
        recaptchaVerifier();
        setLoadingGetCode({ loading: true, success: false })
        signInWithPhoneNumber(dbAuth, '+' + number, window.recaptchaVerifier)
            .then((confirmationResult) => {
                window.confirmationResult = confirmationResult;
                setLoadingGetCode({ loading: false, success: true })
            }).catch(err => {
                setErr(err.message);
                setLoadingGetCode({ loading: false, success: false })
                setLoading(false)
            })
    }
    // recaptchaVerifier
    function recaptchaVerifier() {
        window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
            'size': 'invisible',
            'callback': (response) => {
            },
            'expired-callback': () => {
            }
        }, dbAuth);
    }
    return (
        <div className='h-screen w-full flex items-center'>
            <div className=" w-full lg:w-[50%] h-full flex flex-col items-center justify-center">
                <h2 className='text-4xl'>Welcome</h2>
                <span className='text-sm text-[#AAAAAA] mt-1 mb-4'>Welcome! Please enter your number and verify.</span>
                <form onSubmit={handleSignIn} className="flex lg:w-[60%] w-[80%] max-w-[400px] flex-col gap-3">
                    <div>
                        <div className="mb-2 block">
                            <Label
                                htmlFor="number"
                                value="Phone number"
                            />
                        </div>
                        <PhoneInput
                            id="number"
                            required
                            name='number'
                            className={"!w-full"}
                            country={'uz'}
                            onChange={phone => setNumber(phone)}
                            value={number}
                        />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label
                                htmlFor="code"
                                value="Enter 6 digit code"
                            />
                        </div>
                        <div className="flex items-center w-full gap-1 !text-black">
                            <TextInput
                                id="code"
                                required
                                name='code'
                                className='w-full'
                                type="text"
                                onChange={(e) => setCode(e.target.value)}
                                value={code}
                            />
                            {
                                number.length > 1 ?
                                    <button disabled={loadingGetCode.success} onClick={sendCode} type='button' className={` ${loadingGetCode.success ? "bg-[#7F56DA]" : " bg-[#7F56DA] hover:!bg-[#5d3da3]"}  font-medium px-3 py-[9px] text-white rounded-lg   whitespace-nowrap flex items-center gap-1 `}>
                                        {loadingGetCode.loading ?
                                            <Spinner aria-label="Spinner button example" />
                                            :
                                            <span className='flex items-center gap-2 justify-between'>{loadingGetCode.success ? <><BsArrowLeft />Enter code</> : 'Send code'}</span>
                                        }
                                    </button> :
                                    <button disabled={true} type='button' className="bg-[#9b72f3] hover:!bg-[#5d3da3] whitespace-nowrap px-3 py-[9px] font-medium cursor-no-drop pointer-events-none      text-white transition-all duration-400 rounded-lg flex items-center gap-1">
                                        Send code
                                    </button>
                            }
                        </div>
                        {err && <span className="text-red-500 mt-0.5 font-normal text-sm">{err}</span>}
                    </div>
                    <button type="submit" className="bg-[#7F56DA] hover:!bg-[#5d3da3] px-3 py-[9px] rounded-lg text-white transition-all duration-400  font-medium">
                        {
                            loading ?
                                <Spinner /> :
                                <>Submit</>
                        }
                    </button>
                </form>
            </div >
            <div className="w-[50%] bg-[#F3F4F8] h-full  items-center justify-center hidden lg:flex">
                <div className="w-[300px] h-[300px] rounded-[50%] bg-[#603CB6]"></div>
                <div className='shadow-for-cirle'></div>
            </div>
            <div id='recaptcha-container' className='hidden'></div >
        </div >
    );
}

export default Login;
