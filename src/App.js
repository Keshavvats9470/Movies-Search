import { Route, Routes } from 'react-router-dom';
import './App.css';
import Heropage from './pages/Heropage';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './pages/Home';
import PlaylistDetails from './components/PlaylistDetails';

function App({ userToken }) {
  return (
    <>
      <Routes>
        <Route path="/" element={<Heropage />} />
        <Route path="/sign-up-user-authentication" element={<Signup />} />
        <Route path="/login-user" element={<Login />} />
        <Route path="/homepage/:userToken" element={<Home />} />
        <Route path="/playlist/:userToken" element={<PlaylistDetails />} />
      </Routes>
    </>
  );
}

export default App;
