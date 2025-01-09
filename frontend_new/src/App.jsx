import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Hero from "./Regis.section/Hero";
import Intro from './Regis.section/Intro';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path='/intro' element={<Intro/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

