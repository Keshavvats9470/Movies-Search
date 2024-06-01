import React, { useState } from 'react';
import { db } from '../firebase';
import { getDoc, doc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import loginimg from "../assets/login.jpg"

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userRef = doc(db, 'user-creation', `user-${email}`);
            const docSnapshot = await getDoc(userRef);

            if (docSnapshot.exists()) {
                const userData = docSnapshot.data();
                if (userData.password === password) {
                    // Save the token in local storage
                    localStorage.setItem('userToken', userData.user_token);
                    toast.success('Logged in successfully');
                    // Redirect to dashboard
                    navigate(`/homepage/${userData.user_token}`);
                } else {
                    toast.error('Invalid email or password');
                }
            } else {
                toast.error('User does not exist');
            }
        } catch (error) {
            console.error('Error logging in: ', error);
            toast.error('Error logging in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className='z-20'>
                <ToastContainer />
            </div>
            <div className="md:h-screen lg:h-screen xl:h-screen 2xl:h-screen md:flex z-10">
                <div
                    className="relative overflow-hidden md:flex w-1/2 justify-around items-center hidden brightness-75"
                    style={{
                        backgroundImage: `url(${loginimg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}>
                    <div>

                        {/* <h1 className="text-white font-bold text-4xl font-sans">GoFinance</h1>
                        <p className="text-white mt-1">The most popular peer to peer lending at SEA</p>
                        <button type="submit" className="block w-28 bg-white text-indigo-800 mt-4 py-2 rounded-2xl font-bold mb-2">Read More</button> */}
                    </div>
                    <div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
                    <div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
                    {/* <div className="absolute -top-40 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
                    <div className="absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div> */}
                </div>
                <div className="flex md:w-1/2 justify-center md:mt-0 lg:mt-0 xl:mt-0 mt-20 md:mx-0 lg:mx-0 xl:mx-0 mx-2 py-20 md:border-none lg:border-none xl:border-none border-2 items-center bg-white">
                    <form onSubmit={handleSubmit} className="bg-white">
                        <h1 className="text-gray-800 font-bold text-2xl mb-1">Hello!</h1>
                        <p className="text-sm font-normal text-gray-600 mb-7">Welcome Back</p>
                        <div className="flex items-center border-2 py-2 px-3 rounded-2xl mt-2 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>

                            <input
                                type="email"
                                id="email"
                                placeholder='Email'
                                className="pl-2 outline-none border-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex items-center border-2 py-2 px-3 rounded-2xl mt-2 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fillRule="evenodd"
                                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                    clipRule="evenodd" />
                            </svg>

                            <input
                                type="password"
                                id="password"
                                className="pl-2 outline-none border-none"
                                placeholder='Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Log In'}
                        </button>

                        <div className='py-3'>
                            <p className='text-sm bg-gray-200/60 py-1 px-1'>Don't have an account? <span className='text-blue-600 font-medium'>
                                <Link to={`/sign-up-user-authentication`}>
                                    Sign Up
                                </Link>
                            </span> </p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;
