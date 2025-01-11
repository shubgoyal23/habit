import React from 'react'
import assets from '../asset/asset'

const Frame = () => {
  return (
    <div className='bg-white h-[100vh]'>
        <div className='flex justify-center'>
        <img src={assets.frame} className='w-full h-[45vh]' alt="" />
        </div>
     <p className='mt-20 text-2xl  header pl-5 text-black'>Track Your Goal</p>
     <p className='mt-3 p-4 text-gray-700 header'>Don't worry if you have. trouble determining your goals We can help you determine your 
        goals and track your goals
     </p>
     <div className='flex justify-end mt-40 p-6'>
    <a href="/frame1"> <img src={assets.Button} alt="" />
    </a>
    </div>
    </div>
  )
}

export default Frame