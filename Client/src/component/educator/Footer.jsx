import React from 'react'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <footer className='flex md:flex-row flex-col-reverse items-center justify-between text-left w-full px-8 border-t'>
    <div className='flex items-center gap-3 '>
        <div className='flex items-center'>
        <img className='hidden md:block w-10 sm:8' src={assets.logo_black} alt="logo" />
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-600">EduCrest</h1>
    </div>
    <div className='hidden md:block h-7 w-px bg-gray-500/60'></div>
    <p className='py-4 text-center text-xs md:text-sm text-gray-500'>Copyright 2025  © EduCrust.All Right Reserved.</p>
    </div>
    <div className='flex items-center gap-4 max-md:mt-4'>
        <a href="#">
            <img src={assets.facebook_icon} alt="facebook_icon" />
        </a>
        <a href="#">
            <img src={assets.twitter_icon} alt="twitter_icon" />
        </a>
        <a href="#">
            <img src={assets.instagram_icon} alt="instagram_icon" />
        </a>
    </div>
    </footer>
  )
}

export default Footer