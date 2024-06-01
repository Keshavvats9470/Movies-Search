import React, { useState } from 'react';
import { db } from '../firebase';
import { setDoc, doc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import signupimg from "../assets/signup.jpg"

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const generateToken = () => {
        return Math.random().toString(36).substring(2, 18).padEnd(16, '0');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }
        const userToken = generateToken();
        setLoading(true);
        try {
            await setDoc(doc(db, 'user-creation', `user-${email}`), {
                email_Id: email,
                master: "1",
                password: password,
                user_token: userToken
            });
            toast.success('User signed up successfully');

            // Clear the form fields
            setEmail('');
            setPassword('');
            setConfirmPassword('');

            // Redirect to login page after 5 seconds
            setTimeout(() => {
                navigate('/login-user');
            }, 5000);
        } catch (error) {
            console.error('Error adding document: ', error);
            toast.error('Error signing up');
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
                        backgroundImage: `url(${signupimg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}>
                    <div>

                    </div>
                    <div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
                    <div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
                </div>
                <div className="flex md:w-1/2 justify-center md:mt-0 lg:mt-0 xl:mt-0 mt-20 md:mx-0 lg:mx-0 xl:mx-0 mx-2 py-20 md:border-none lg:border-none xl:border-none border-2 items-center bg-white">
                    <form onSubmit={handleSubmit} className="bg-white">
                        <h1 className="text-gray-800 font-bold text-2xl mb-1">Hello!</h1>
                        <p className="text-sm font-normal text-gray-600 mb-7">Welcome</p>
                        <div className="flex items-center border-2 py-2 px-3 rounded-2xl mt-2 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
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
                                <path fill-rule="evenodd"
                                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                    clip-rule="evenodd" />
                            </svg>

                            <input
                                type="password"
                                id="password"
                                className="pl-2 outline-none border-none"
                                placeholder='Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required />

                        </div>
                        <div className="flex items-center border-2 py-2 px-3 rounded-2xl mt-2 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                    clip-rule="evenodd" />
                            </svg>
                            <input
                                type="password"
                                id="confirmPassword"
                                className="pl-2 outline-none border-none"
                                placeholder='Confirm Password'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required />
                        </div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            disabled={loading}
                        >
                            {loading ? 'Signing up...' : 'Sign Up'}
                        </button>

                        <div className='py-3'>
                            <p className='text-sm bg-gray-200/60 py-1 px-1'>Already have an account? <span className='text-blue-600 font-medium'>
                                <Link to={`/login-user`}>
                                    Login Now
                                </Link>
                            </span> </p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Signup