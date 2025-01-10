import React from 'react';
import assets from '../asset/asset';

const Hero = () => {
  return (
    <div className='h-screen  bg-gradientPurple flex justify-center items-center'>
      <div>
        <img  src={assets.Hero} alt="Hero" />
        <button
  className="absolute bottom-40 left-1/2 transform -translate-x-1/2 bg-white rounded-full w-80 py-3 shadow-lg hover:shadow-xl transition duration-300 ease-in-out flex justify-center items-center">
  <a className='text-black text-lg font-semibold tracking-wide ' href="/intro">Get Started</a>
</button>

      </div>
    </div>
  );
};

export default Hero;
