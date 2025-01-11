import React from 'react';
import assets from '../asset/asset';

const Hero = () => {
  return (
    <div className='h-[100vh] bg-gradientPurple flex justify-center pt-20 '>
      <div>
        <img  src={assets.Hero} alt="Hero" />
        <button
       className="absolute mt-40 left-1/2 transform -translate-x-1/2 bg-white rounded-full w-80 py-3 shadow-lg hover:shadow-xl transition duration-300 ease-in-out flex justify-center items-center">
      <a className='text-black header  text-xl font-semibold' href="/intro">Get Started</a>
      </button>
      </div>
    </div>
  );
};

export default Hero;
