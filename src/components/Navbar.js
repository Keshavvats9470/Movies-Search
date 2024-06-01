import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from "../assets/mi.png"

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const userToken = localStorage.getItem('userToken');

    useEffect(() => {
        function handleClickOutside(event) {
            if (isMenuOpen && !event.target.closest('#menu') && !event.target.closest('button[for="menu-toggle"]')) {
                setIsMenuOpen(false);
            }
        }

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isMenuOpen]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const isLoggedIn = localStorage.getItem('userToken');

    // Function to handle logout
    const handleLogout = () => {
        localStorage.removeItem('userToken');
        // Redirect to the login page
        window.location.href = '/login-user';
    };

    return (
        <section className='bg-[#0B0B0B]'>
            <header className="lg:px-16 px-4 mx-auto max-w-7xl flex flex-wrap items-center py-2 ">
                <div className="flex-1 flex justify-between items-center">
                    <Link to={`/`} className="text-xl">
                        <img src={logo} alt="Company Logo" className="h-16" />
                    </Link>
                </div>

                <button htmlFor="menu-toggle" className="pointer-cursor md:hidden block" onClick={toggleMenu}>
                    <svg className="fill-current text-gray-400"
                        xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                        <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
                    </svg>
                </button>
                <input className="hidden" type="checkbox" id="menu-toggle" />

                <div className={`${isMenuOpen ? 'block' : 'hidden'} md:flex md:items-center md:w-auto w-full`} id="menu">
                    <nav>
                        <ul className="md:flex items-center justify-between text-base text-gray-700 pt-4 md:pt-0 md:space-y-0 lg:space-y-0 xl:space-y-0 2xl:space-y-0 space-y-2">
                            <li><Link to={`/playlist/${userToken}`} className="md:p-4 py-2 px-2 block text-gray-400 tracking-[2px] uppercase hover:bg-gray-900 rounded-md hover:transition hover:ease-in-out hover:duration-150" href="#">Playlists</Link></li>
                            <hr className='opacity-30 md:hidden lg:hidden xl:hidden block' />
                            {isLoggedIn ? (
                                <li><button onClick={handleLogout} className="md:p-4  text-gray-400 tracking-[2px] uppercase   px-2">Logout</button></li>
                            ) : (
                                <li><Link to={``} className="md:p-4 py-3 px-0 block text-gray-400 tracking-[2px] uppercase" href="#">Login</Link></li>
                            )}
                        </ul>
                    </nav>
                </div>
            </header>
        </section>
    );
}

export default Navbar;
