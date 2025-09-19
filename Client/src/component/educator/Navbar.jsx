import React, { useContext } from 'react'
import { assets, dummyEducatorData } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {

    const educatorData = dummyEducatorData
    const navigate=useNavigate()
    const { userData, backendUrl, setUserData, setIsLoggedIn } = useContext(AppContext)

  return (
   <div className="bg-blue-300 border-b border-gray-500">
  <div className="flex justify-between items-center px-4 py-3 max-w-6xl mx-auto w-full">
    
    {/* Logo */}
    <div onClick={() => navigate('/')} className="flex items-center cursor-pointer text-gray-800">
      <img src={assets.logo_black} alt="logo" className="w-10 sm:w-12" />
      <h1 className="text-xl sm:text-2xl font-semibold">EduCrest</h1>
    </div>

    {/* Right Section */}
    <div className="flex items-center gap-3 ">
      <p>Hi! {userData ? userData.fullName : 'Developers'}</p>
      {userData ? <UserButton /> : <img src={assets.profile_img} alt="user icon" className="w-8 h-8 rounded-full" />}
    </div>
  </div>
</div>

  )
}

export default Navbar