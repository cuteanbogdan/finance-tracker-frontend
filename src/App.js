import React from 'react';
import Login from './components/Login';
import SignUp from './components/Signup'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GlobalStyle from './GlobalStyle';
import Homepage from './components/Homepage';
import UserProfile from './components/UserProfile';

function App() {
  return (
    <>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/home" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </Router></>

  );
}

export default App;
