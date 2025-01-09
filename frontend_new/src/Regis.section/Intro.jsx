import React from 'react'
import assets from '../asset/asset'

const Intro = () => {
  return (
    <div className='h-screen  bg-customPurple'>
        <div className='flex mb-10 justify-center'>
        <div className='pt-10 w-40 h-30'>
          <img src={assets.Hero} alt="" />
        </div>
        </div>
       <div className='flex flex-col justify-center items-center'>
        <h2 className='text-white text-3xl font-bold mb-2'>Hi User, Welcome</h2>
        <span className='text-white text-3xl italic mb-4'>to Main Habit</span>
       </div>
        <p className='text-white flex justify-center items-center'>Explore the app, Find some peace of mind </p>
        <p className='text-white  flex justify-center items-center'> to achive good habits.</p>
     
        <div className="mt-10 relative flex justify-center items-center">
  {/* Background Image */}
  <img
    src={assets.circle}
    className="absolute inset-0 w-100 h-100 object-contain"
    alt="Background Circle"
  />

  {/* Foreground Character Image */}
  <div>
  <img
    src={assets.char}
    className="relative w-100 h-100 object-contain"
    alt="Character"
  />
 <div className='relative'>
  <img src={assets.rect} className='w-full object-contain' />
  
  {/* Button */}
  <button className="absolute  bottom-40 left-1/2 transform -translate-x-1/2 bg-customWhite tracking-wide w-80 py-3 px-2 text-2xl font-bold  rounded-full bg-white transition duration-300 ease-in-out">
    Get Started
  </button>
</div>
  </div>
  
</div>

    </div>
  )
}

export default Intro