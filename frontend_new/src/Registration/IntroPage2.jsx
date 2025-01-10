import React from 'react'
import assets from '../asset/asset'

const Intro = () => {
  return (
    <div className='h-[100vh] overflow-hidden bg-customPurple'>
      <div className='flex mb-5 justify-center'>
        <div className='w-20  h-20 mt-4 '>
          <img src={assets.Hero} alt="" />
        </div>
      </div>
      <div className='flex flex-col justify-center items-center'>
        <h2 className='text-white text-3xl font-bold mb-2'>Hi User, Welcome</h2>
        <span className='text-white text-3xl italic mb-4'>to Main Habit</span>
      </div>
      <p className='text-white flex justify-center items-center'>Explore the app, Find some peace of mind </p>
      <p className='text-white flex justify-center items-center'>to achieve good habits.</p>

      <div className="mt-10 relative flex justify-center items-center">
        {/* Background Image */}
        <img className='absolute inset-0 ml-3 h-4' src={assets.brid} alt="" />
        <img className='absolute inset-0 ml-20 h-4' src={assets.brid} alt="" />

        <img
          src={assets.circle}
          className="absolute inset-0 w-full h-auto object-contain"
          alt="Background Circle"
        />
        <img src={assets.cloud} className='absolute inset-0 ml-[75%] h-auto object-contain' alt="" />
         
        {/* Foreground Character Image */}
        <div>
          <img
            src={assets.char}
            className="relative w-100 h-100 object-contain"
            alt="Character"
          />
          <div className='relative'>
            <img src={assets.rect} className='w-full object-contain' alt="Rect" />

            {/* Button */}
            <a href="/signin"><button className="absolute bottom-40 left-1/2 transform -translate-x-1/2 bg-customWhite tracking-wide w-80 py-3 px-2 text-2xl font-bold rounded-full bg-white transition duration-300 ease-in-out">
             Get Started 
            </button></a>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Intro
