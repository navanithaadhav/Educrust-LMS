
import { useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

import { Link as ScrollLink } from 'react-scroll'
import { FaShoppingCart, FaBell, FaUserCircle } from 'react-icons/fa'
import Explore from './Explore'
import { assets } from '../../assets/assets'


const Navbar = () => {
  const navigate = useNavigate()
  const { userData, backendUrl, setUserData, setIsLoggedIn } = useContext(AppContext)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showExplore, setShowExplore] = useState(false);

  

  const handleLogin = () => { 
    navigate('/login')
  }

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true
      const { data } = await axios.post(backendUrl + '/api/user/send-verify-otp')
      if (data.success) {
        navigate('/emailverify')
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true
      const { data } = await axios.post(backendUrl + '/api/auth/logout')
      if (data.success) {
        setIsLoggedIn(false)
        setUserData(null)
        navigate('/')
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <nav className="sticky top-0 left-0 w-full z-50 bg-blue-900 text-white px-4 sm:px-10 py-3">

      <div className="flex justify-between items-center">
        {/* Logo */}
        <div onClick={() => navigate('/')} className="flex items-center   cursor-pointer">
          <img src={assets.logo} alt="logo" className="w-10 sm:w-12" />
          <h1 className="text-xl sm:text-2xl font-semibold">EduCrest</h1>
        </div>
        

        {/* Hamburger Icon */}
        {/* <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
              viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div> */}

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-6 items-center">
          <div
            className="relative cursor-pointer hover:text-yellow-400"
            onClick={() => setShowExplore(!showExplore)}
          >
            Explore
            {showExplore && (
              <div className="absolute left-0 top-16 z-50 bg-white text-black shadow-md">
                <Explore isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
              </div>
            )}
          </div>


          <ScrollLink  smooth duration={500} offset={-70} className="cursor-pointer hover:text-yellow-400">About</ScrollLink>
          <ScrollLink onClick={()=>navigate('/course-list')} smooth duration={500} offset={-70} className="cursor-pointer hover:text-yellow-400">Course</ScrollLink>
          <ScrollLink  smooth duration={500} offset={-70} className="cursor-pointer hover:text-yellow-400">Contact</ScrollLink>
          <ScrollLink onClick={()=>navigate('/my-enrollments')} smooth duration={500} offset={-70} className="cursor-pointer hover:text-yellow-400">My Enrollments</ScrollLink>       
          <ScrollLink onClick={()=>navigate('/educator')} smooth duration={500} offset={-70} className="cursor-pointer hover:text-yellow-400">Educator Dashboard</ScrollLink>       
        
        </div>
      
      {/* Mobile Menu */}
     {isMenuOpen && (
  
  <div className="md:hidden absolute top-full left-0 w-full bg-black text-white px-4 py-3 z-50 flex flex-col gap-2">
    
    <div
      onClick={() => setShowExplore(!showExplore)}
      className="cursor-pointer hover:text-yellow-400"
    >
      Explore
    </div> 
 
    {showExplore && (
      <div className="bg-white text-black rounded shadow-lg">
        <Explore />
      </div>
    )}

    <ScrollLink
      to="about"
      smooth
      duration={500}
      offset={-70}
      className="cursor-pointer hover:text-yellow-400"
      onClick={() => setIsMenuOpen(false)} // optional: closes menu on click
    >
      About
    </ScrollLink> 


    <ScrollLink
      to="course"
      smooth
      duration={500}
      offset={-70}
      className="cursor-pointer hover:text-yellow-400"
      onClick={() => setIsMenuOpen(false)}
    >
      Course
    </ScrollLink>

    <ScrollLink
      to="contact"
      smooth
      duration={500}
      offset={-70}
      className="cursor-pointer hover:text-yellow-400"
      onClick={() => setIsMenuOpen(false)}
    >
      Contact
    </ScrollLink>
    
    <ScrollLink
      to="my-enrollments"
      smooth
      duration={500}
      offset={-70}
      className="cursor-pointer hover:text-yellow-400"
      onClick={() => setIsMenuOpen(false)}
    >
      My Enrollments
    </ScrollLink>
    
  </div>
  
)}




      {/* Icons and User */}
      <div className=' flex items-center gap-4'>
        <FaShoppingCart className='text-white text-xl cursor-pointer hover:text-yellow-400 ' />
        <FaBell className='text-white text-xl cursor-pointer hover:text-yellow-400 ' />
       
        {userData ? (
          <div
            className='text-white bg-gray-800 w-8 h-8 rounded-full flex justify-center items-center relative cursor-pointer'
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            {userData.name[0].toUpperCase()}
            {showProfileMenu && (
              <div className='absolute right-0 top-10 w-40 bg-white rounded shadow-md z-50'>
                <ul className='text-sm text-black'>
                  {!userData.isAccountVerified && (
                    <li onClick={sendVerificationOtp} className='px-4 py-2 hover:bg-gray-100 cursor-pointer'>
                      Verify Email
                    </li>
                  )}
                  <li onClick={logout} className='px-4 py-2 hover:bg-gray-100 cursor-pointer'>
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-white hover:text-black hover:bg-white transition-all'
          >
            Login
           
          </button>
        )}
      </div>
      </div>

    </nav>
  )
}

export default Navbar    