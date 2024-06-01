import React from 'react';
import Homepage from '../components/Homepage';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PlaylistDetails from '../components/PlaylistDetails';

function Home() {
    const { userToken } = useParams();

    return (
        <div>

            <Navbar />

            <Homepage userToken={userToken} />
            <PlaylistDetails />
        </div>
    );
}

export default Home;
