import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';  // Ensure correct path to firebase.js
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore"; // Import necessary functions for Firestore
import ConfirmModal from './ConfirmModal'; // Ensure correct path to ConfirmModal.js

function PlaylistDetails() {
    const { userToken } = useParams();  // Get userToken from URL parameters
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [movieToDelete, setMovieToDelete] = useState(null);

    useEffect(() => {
        const fetchPlaylists = async () => {
            if (!userToken) return;

            try {
                console.log(`Fetching playlists for user: ${userToken}`);

                // Reference to the playlists collection
                const playlistsRef = collection(db, `users/${userToken}/playlists`);

                // Fetching documents from the playlists collection
                const querySnapshot = await getDocs(playlistsRef);

                if (querySnapshot.empty) {
                    console.log("No playlists found for this user.");
                } else {
                    const playlistsList = querySnapshot.docs.map(doc => doc.id);
                    setPlaylists(playlistsList);
                    if (playlistsList.length > 0) {
                        setSelectedPlaylist(playlistsList[0]);  // Select the first playlist by default
                    }
                }
            } catch (error) {
                console.error("Error fetching playlists:", error);
                setError("Failed to fetch playlists. Please try again later.");
            }
        };

        fetchPlaylists();
    }, [userToken]);

    useEffect(() => {
        const fetchMovies = async () => {
            if (!userToken || !selectedPlaylist) return;

            try {
                console.log(`Fetching movies for user: ${userToken}, playlist: ${selectedPlaylist}`);

                // Reference to the movies collection inside the specific playlist
                const moviesRef = collection(db, `users/${userToken}/playlists/${selectedPlaylist}/movies`);

                // Fetching documents from the movies collection
                const querySnapshot = await getDocs(moviesRef);

                if (querySnapshot.empty) {
                    console.log("No movies found in this playlist.");
                } else {
                    const moviesList = querySnapshot.docs.map(doc => {
                        console.log(`Fetched movie: ${doc.id} - Data: `, doc.data());
                        return { id: doc.id, ...doc.data() };
                    });
                    setMovies(moviesList);
                }
            } catch (error) {
                console.error("Error fetching movies:", error);
                setError("Failed to fetch movies. Please try again later.");
            }
        };

        fetchMovies();
    }, [userToken, selectedPlaylist]);

    const handleRemoveClick = (movie) => {
        setMovieToDelete(movie);
        setShowModal(true);
    };

    const handleConfirmRemove = async () => {
        if (!userToken || !selectedPlaylist || !movieToDelete) return;

        try {
            console.log(`Removing movie: ${movieToDelete.id} from user: ${userToken}, playlist: ${selectedPlaylist}`);

            // Reference to the specific movie document inside the specific playlist
            const movieDoc = doc(db, `users/${userToken}/playlists/${selectedPlaylist}/movies`, movieToDelete.id);

            // Delete the document
            await deleteDoc(movieDoc);

            // Remove the movie from the state
            setMovies(movies.filter(movie => movie.id !== movieToDelete.id));
            setShowModal(false);
            setMovieToDelete(null);
        } catch (error) {
            console.error("Error removing movie:", error);
            setError("Failed to remove movie. Please try again later.");
        }
    };

    return (
        <section className='min-h-screen bg-black'>
            <div className="max-w-7xl mx-auto md:px-0 lg:px-0 xl:px-0 px-2 py-10">
                <h1 className="border-l-4 border-gray-300 px-3 text-3xl font-bold text-yellow-500 mb-4">Your favorite movies</h1>

                {error && <p className="text-red-500">{error}</p>}

                {playlists.length > 0 ? (
                    <div>
                        <div className="mb-4 md:flex md:justify-end lg:flex lg:justify-end xl:flex xl:justify-end flex-none">
                            <select
                                className="bg-slate-800 text-white px-4 py-1.5 rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer "
                                value={selectedPlaylist}
                                onChange={(e) => setSelectedPlaylist(e.target.value)}
                            >
                                {playlists.map((playlist) => (
                                    <option
                                        key={playlist}
                                        value={playlist}
                                        className="bg-gray-800 text-white py-4 px-4 hover:bg-gray-700 border-0"
                                    >
                                        {playlist}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <hr className='opacity-25 mt-6' />

                        {movies.length > 0 ? (
                            <div className='md:block lg:block xl:block 2xl:block flex justify-center mx-auto'>
                                <div className="grid grid-cols-1  md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:mt-10 justify-center mx-auto">
                                    {movies.map((movie) => (
                                        <div key={movie.id} className="border border-gray-600/40 rounded-lg bg-[#121212] w-60 h-auto p-3 flex flex-col justify-between">
                                            <div>
                                                <img src={movie.Poster} alt={movie.Title} className="w-full h-72 object-cover rounded-t-lg mb-2" />
                                                <div className="space-y-1.5">
                                                    <h2 className="text-lg font-semibold text-yellow-500 line-clamp-2">{movie.Title} ({movie.Year})</h2>
                                                    <div className="flex items-center text-gray-500 text-sm">
                                                        <span className="text-yellow-500 mr-1">★</span>
                                                        <span>{movie.imdbRating}</span>
                                                    </div>
                                                    <p className="text-gray-500 text-sm truncate"><span className="font-semibold text-gray-200">Genre:</span> {movie.Genre}</p>
                                                </div>
                                            </div>
                                            <hr className='opacity-15 mt-2' />
                                            <div className="mt-4">
                                                <button
                                                    onClick={() => handleRemoveClick(movie)}
                                                    className='bg-gray-800 px-4 py-2 text-sm font-semibold tracking-wide rounded-lg text-white w-full hover:bg-gray-700'>
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-gray-500 text-xl">No movies found in this playlist.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 text-xl">No playlists found for this user.</p>
                    </div>
                )}
            </div>
            <ConfirmModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleConfirmRemove}
            />
        </section>
    );
}

export default PlaylistDetails;
