import React, { useState } from 'react';
import assets from '../asset/asset';

const Login = () => {
  const [hide, setHide] = useState(false);

  const handleToggle = () => {
    setHide(!hide);
  };

  return (
    <div
      className="bg-white h-[100vh] p-3"
      style={{ backgroundImage: `url(${assets.Bg})` }}
    >
      {/* Back button */}
      <a href="/intro">
        <img className="text-black bg-white" src={assets.back} alt="" />
      </a>

      {/* Welcome Header */}
      <div className="flex justify-center mt-5">
        <h2 className="text-4xl text-gray-700 header">Welcome Back!</h2>
      </div>

      {/* Social Login Icons */}
      <div className="mt-20 flex flex-col space-y-7 mb-2">
        {/* <img src={assets.Facebook} alt="facebook" /> */}
        <img className='cursor-pointer' src={assets.google} alt="google" />
      </div>

      {/* OR */}
      <div className="flex justify-center">
        <p className="text-[10px] cursor-pointer text-purple-700 font-extrabold ">
          OR LOG IN WITH EMAIL
        </p>
      </div>

      {/* Email and Password Fields */}
      <div className="flex flex-col mt-20 space-y-5">
        <input
          className="bg-gray-200 w-full text-black p-3 rounded-xl header border-2 border-transparent focus:border-customPurple outline-none transition duration-300"
          // className="bg-gray-200 text-black p-3 rounded-xl header"
          type="text"
          placeholder="Email"
        />

        {/* Password Field */}
        <div className="relative">
          <input
            className="bg-gray-200 w-full text-black p-3 rounded-xl header border-2 border-transparent focus:border-customPurple outline-none transition duration-300"
            // className="bg-gray-200 p-3 text-black rounded-xl header w-full"
            type={hide ? 'text' : 'password'}
            placeholder="Password"
          />
          {/* Toggle Password Icon */}
          <img
            src={hide ? assets.show : assets.hide}
            alt="toggle password visibility"
            className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer w-6 h-6"
            onClick={handleToggle}
          />
        </div>
      </div>

      {/* Login Button */}
      <div className="flex justify-center mt-5">
        <button className="bg-customPurple header p-3 text-white font-extrabold rounded-3xl w-full">
          LOG IN
        </button>
      </div>

      {/* Forgot Password */}
      <div className="flex justify-center mt-2">
        <p className="text-[12px] cursor-pointer header">Forgot password?</p>
      </div>

      {/* Sign Up */}
      <div className="flex justify-center mt-10">
        <p className="text-[14px] header">DON'T HAVE AN ACCOUNT? </p>
        <a href="/signup" className="text-[14px] header text-customPurple">
          _SIGN UP
        </a>
      </div>
    </div>
  );
};

export default Login;
