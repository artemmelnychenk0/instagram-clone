import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import SignIn from './Components/Authentication/Authentication';
import Home from './Components/Home/Home';
import Messages from './Components/Messages/Messages';
import Profile from './Components/Profile/Profile';
import Navigation from './Components/Nav/Nav';
import Post from './Components/Post/Post';
import { useState } from 'react';

function App() {

  const [post, setPost] = useState()

  const toPost = (current) => {
    setPost(current)
  }

  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path='/home' element={<Home />} />
        <Route path='/profile' element={<Profile toPost={toPost} />} />
        <Route path='/messages' element={<Messages />} />
        <Route path='/signup' element={<SignIn />} />
        <Route path='/post/:id' element={<Post post={post} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
