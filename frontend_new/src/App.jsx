import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Hero from "./Registration/HeroPage1";
import Intro from './Registration/IntroPage2';
import Login from './Registration/SigninPage3';
import SingUp from './Registration/SingUp3';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path='/intro' element={<Intro/>}/>
          <Route path='/signin' element={<Login/>}/>
          <Route path='/signup' element={<SingUp/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

