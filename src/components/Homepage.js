import React, { useState, useEffect, useCallback } from 'react';
import { apiKey } from "./API";
import { db } from '../firebase';
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import backgroundImage from "../assets/bghome.png";
import axios from 'axios';

function Homepage() {
    const userToken = localStorage.getItem('userToken');
    const [searchTerm, setSearchTerm] = useState("");
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [playlistName, setPlaylistName] = useState("");
    const [playlists, setPlaylists] = useState([]);
    const [toastMessage, setToastMessage] = useState("");
    const [showToast, setShowToast] = useState(false);

    const fetchPlaylists = useCallback(async () => {
        const playlistsRef = collection(db, `users/${userToken}/playlists`);
        try {
            const querySnapshot = await getDocs(playlistsRef);
            const playlistsList = querySnapshot.docs.map(doc => doc.id);
            setPlaylists(playlistsList);
        } catch (error) {
            console.error("Error fetching playlists:", error);
        }
    }, [userToken]);

    useEffect(() => {
        if (userToken) {
            fetchPlaylists();
        }
    }, [userToken, fetchPlaylists]);

    const onSearchHandler = () => {
        if (!searchTerm) {
            return;
        }

        axios.get(`http://www.omdbapi.com/`, {
            params: {
                t: searchTerm,
                apiKey: apiKey,
            }
        })
            .then(response => {
                setData(response.data);
                setError(null);
            })
            .catch(error => {
                setError(error.message);
                setData(null);
            });
    };

    const addToPlaylistHandler = () => {
        setShowModal(true);
        fetchPlaylists();
    };

    const sanitizePlaylistName = (name) => {
        return name.replace(/[^a-zA-Z0-9_-]/g, "_");
    };

    const createPlaylistHandler = async () => {
        if (playlistName) {
            const sanitizedPlaylistName = sanitizePlaylistName(playlistName);
            const playlistRef = doc(db, `users/${userToken}/playlists`, sanitizedPlaylistName);
            await setDoc(playlistRef, { name: sanitizedPlaylistName });
            const movieRef = doc(db, `users/${userToken}/playlists/${sanitizedPlaylistName}/movies`, data.imdbID);
            await setDoc(movieRef, data);
            setShowModal(false);
            setPlaylistName("");
            fetchPlaylists();
            showToastNotification("Playlist created and movie added successfully - Kindly Reload!");
        }
    };

    const addExistingPlaylistHandler = async (existingPlaylist) => {
        const movieRef = doc(db, `users/${userToken}/playlists/${existingPlaylist}/movies`, data.imdbID);
        await setDoc(movieRef, data);
        setShowModal(false);
        fetchPlaylists();
        showToastNotification("Movie added to the existing playlist - Kindly Reload!");
    };

    const showToastNotification = (message) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    const Toast = ({ message }) => (
        <div className={`fixed bottom-4 right-4 p-4 bg-yellow-500 text-black rounded-lg shadow-md transition-opacity duration-300 ${showToast ? 'opacity-100' : 'opacity-0'}`}>
            {message}
        </div>
    );

    return (
        <section className='h-screen bg-black' style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
            <div className="max-w-7xl mx-auto md:px-0 lg:px-0 xl:px-0 px-2">
                <div className='py-6'>
                    <form className="max-w-xl mx-auto">
                        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="block w-full p-4 ps-10 text-sm text-gray-300 border border-gray-500/30 rounded-lg bg-[#0E0C0A] focus:outline-none focus:border-yellow-700"
                                placeholder="Search Movies..."
                                required
                            />
                            <button
                                type="button"
                                className="text-white absolute end-2.5 bottom-2.5 bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
                                onClick={onSearchHandler}
                            >
                                Search
                            </button>
                        </div>
                    </form>

                    {error && <p className="text-red-500">{error}</p>}

                    {data && (
                        <div className="mt-6 border border-gray-500/40 p-3 rounded-lg md:p-4 lg:p-4 xl:p-4 mx-auto max-w-3xl bg-[#121212]">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                <img src={data.Poster} alt={data.Title} className="w-44 h-auto mb-4 lg:mb-0 lg:mr-4 mx-auto" />
                                <div className='space-y-2.5'>
                                    <h2 className="md:text-xl text-xl lg:text-2xl xl:text-2xl font-semibold text-yellow-500">{data.Title} ({data.Year})</h2>
                                    <p className="text-gray-500 mt-2 text-sm"><span className="font-semibold text-gray-200">Director:</span> {data.Director}</p>
                                    <p className="text-gray-500 text-sm"><span className="font-semibold text-gray-200">Actors:</span> {data.Actors}</p>
                                    <p className="text-gray-500 text-sm"><span className="font-semibold text-gray-200">Genre:</span> {data.Genre}</p>
                                    <p className="text-gray-500 text-sm"><span className="font-semibold text-gray-200">Plot:</span> {data.Plot}</p>
                                    <p className="text-gray-500 text-sm pb-3"><span className="font-semibold text-gray-200">IMDb Rating:</span> {data.imdbRating}</p>
                                    <button
                                        className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-1.5 px-5 rounded-lg bg-gray-800 hover:bg-yellow-500 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none flex items-center gap-2"
                                        type="button"
                                        onClick={addToPlaylistHandler}
                                    >
                                        Add to Playlist
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="h-4 w-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {showModal && (
                        <div className="fixed z-10 inset-0 overflow-y-auto">
                            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                                </div>

                                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        <div>
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">Manage Playlist</h3>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    value={playlistName}
                                                    onChange={(e) => setPlaylistName(e.target.value)}
                                                    placeholder="New Playlist Name"
                                                    className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                                                />
                                                <button
                                                    className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded-md"
                                                    onClick={createPlaylistHandler}
                                                >
                                                    Create Playlist
                                                </button>
                                                <div className="mt-4">
                                                    {playlists.length > 0 ? (
                                                        <>
                                                            <h4 className="text-md font-medium text-gray-900">Add to Existing Playlist</h4>
                                                            <ul className="mt-2">
                                                                {playlists.map((playlist, index) => (
                                                                    <li key={index} className="mt-1">
                                                                        <button
                                                                            className="bg-gray-800 text-white px-4 py-2 rounded-md w-full text-left"
                                                                            onClick={() => addExistingPlaylistHandler(playlist)}
                                                                        >
                                                                            {playlist}
                                                                        </button>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </>
                                                    ) : (
                                                        <p className="mt-2 text-sm text-gray-500">No existing playlists found.</p>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                className="mt-4 bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                                                onClick={() => setShowModal(false)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {showToast && <Toast message={toastMessage} />}
                </div>
            </div>
        </section>
    );
}

export default Homepage;
