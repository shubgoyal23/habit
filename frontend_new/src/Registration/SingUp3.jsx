import React, { useState } from 'react';
import assets from '../asset/asset';

const SignUp = () => {
    const [hide, setHide] = useState(false);

    const handleToggle = () => {
        setHide(!hide);
    };

    return (
        <div className="p-3 bg-white min-h-screen" style={{ backgroundImage: `url(${assets.Bg})` }}>
            {/* Back Button */}
            <a href="/intro">
                <img src={assets.back} alt="" />
            </a>

            {/* Header */}
            <div className="mt-10 flex justify-center">
                <h1 className="text-3xl header text-gray-700">Create your account</h1>
            </div>

            {/* Social Login Icons */}
            <div className="flex flex-col space-y-5 mt-10">
                {/* <img src={assets.Facebook} alt="facebook" /> */}
                <img className='cursor-pointer' src={assets.google} alt="google" />
            </div>

            {/* OR */}
            <div className="flex justify-center mt-10">
                <p className="text-[10px] text-purple-600 cursor-pointer font-extrabold header">
                    OR LOG IN WITH EMAIL
                </p>
            </div>

            <div className=' mt-5 | space-y-5'>
                <input
                    type="text"
                    className="bg-gray-200 w-full text-black p-3 rounded-xl header border-2 border-transparent focus:border-customPurple outline-none transition duration-300"
                    placeholder="First Name"
                />

                <input
                    type="text"
                    className="bg-gray-200 w-full text-black p-3 rounded-xl header border-2 border-transparent focus:border-customPurple outline-none transition duration-300"
                    placeholder="Last Name"
                />

            </div>
            {/* Input Fields */}
            <div className="flex flex-col space-y-5 mt-5">

                <input
                    type="text"
                    className="bg-gray-200 w-full text-black p-3 rounded-xl header border-2 border-transparent focus:border-customPurple outline-none transition duration-300"
                    placeholder="G-mail"
                />


                {/* Password Field with Toggle */}
                <div className="relative">
                    <input
                        type={hide ? 'text' : 'password'}
                        className="bg-gray-200 w-full text-black p-3 rounded-xl header border-2 border-transparent focus:border-customPurple outline-none transition duration-300"
                        placeholder="Password"
                    />
                    <img
                        src={hide ? assets.show : assets.hide}
                        alt="toggle password visibility"
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer w-6 h-6"
                        onClick={handleToggle}
                    />
                </div>
            </div>

            {/* Privacy Policy with Checkbox */}
            <div className="flex items-center mt-5">
                <input
                    type="checkbox"
                    className="mr-2 accent-customPurple"
                    id="privacyPolicy"
                />
                <label htmlFor="privacyPolicy" className="header text-[15px]">
                    I have read the{' '}
                    <a className="header text-customPurple" href="">
                        Privacy Policy
                    </a>
                </label>
            </div>

            {/* Get Started Button */}
            <div className="flex justify-center mt-5">
                <button className="bg-customPurple header p-3 text-white font-extrabold rounded-3xl w-full">
                    GET STARTED
                </button>
            </div>

            {/* Sign In Link */}
            <div className="flex justify-center mt-20">
                <p className="header">ALREADY HAVE AN ACCOUNT?</p>
                <a className="header text-customPurple ml-2" href="/signin">
                    _SIGN IN
                </a>
            </div>
        </div>
    );
};

export default SignUp;
