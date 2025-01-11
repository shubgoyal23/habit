import React from 'react'
import assets from '../asset/asset'
const Frame1 = () => {
  return (
    <div className='bg-white h-[100vh]'>
    <div className='flex justify-center'>
    <img src={assets.frame1} className='w-full h-[45vh]' alt="" />
    </div>
 <p className='mt-20 text-2xl  header pl-5 text-black'>Get Burn</p>
 <p className='mt-3 p-4 text-gray-700 header'>Let's keep burning to achive yours goals, it hurts only temporarily, if you give up
    now you will be in pain forever
 </p>
 <div className='flex justify-end mt-40 p-6'>
 <a href="/frame2"><img src={assets.Button} alt="" />
 </a>
</div>
</div>
  )
}

export default Frame1