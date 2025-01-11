import React from 'react'
import assets from '../asset/asset'
const Frame2 = () => {
  return (
    <div className='bg-white h-[100vh]'>
    <div className='flex justify-center'>
    <img src={assets.frame2} className='w-full h-[45vh]' alt="" />
    </div>
 <p className='mt-20 text-2xl  header pl-5 text-black'>Eat Well</p>
 <p className='mt-3 p-4 text-gray-700 header'>
  Let's start a healthy lifestyle with us, we can determine your diet every day healthy
  eating is fun
 </p>
 <div className='flex justify-end mt-40 p-6'>
  <a href='/frame3'>   <img src={assets.Button} alt="" />
  </a>

</div>
</div> 
  )
}

export default Frame2