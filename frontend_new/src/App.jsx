import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Hero from "./Registration/HeroPage1";
import Intro from './Registration/IntroPage2';
import Login from './Registration/SigninPage3';
import SingUp from './Registration/SingUp3';
import Frame from './OnBoarding/Frame';
import Frame1 from './OnBoarding/Frame1';
import Frame3 from './OnBoarding/Frame3';
import Frame2 from './OnBoarding/Frame2';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path='/intro' element={<Intro/>}/>
          <Route path='/signin' element={<Login/>}/>
          <Route path='/signup' element={<SingUp/>}/>
          <Route path='/frame' element={<Frame/>}/>
          <Route path='/frame1' element={<Frame1/>}/>
          <Route path='/frame2' element={<Frame2/>}/>
          <Route path='/frame3' element={<Frame3/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

