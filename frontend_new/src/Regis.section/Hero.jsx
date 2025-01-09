import React from 'react';
import assets from '../asset/asset';

const Hero = () => {
  return (
    <div className='h-screen  bg-gradientPurple flex justify-center items-center'>
      <div>
        <img className='h-30' src={assets.Hero} alt="Hero" />
        <div className='flex justify-center items-center mt-10'>
         <a className='bg-blue-900  text-white text-lg font-bold py-2 px-5 rounded-2xl' href="/intro">Get Start</a>
      </div>
      </div>
    </div>
  );
};

export default Hero;
