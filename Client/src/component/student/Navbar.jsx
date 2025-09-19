import { Link as ScrollLink } from 'react-scroll'
import { FaShoppingCart, FaBell, FaUserCircle } from 'react-icons/fa'

import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { useClerk,UserButton,useUser } from '@clerk/clerk-react'



const Navbar = () => {
    
    const isCourseListPage = location.pathname.includes('/course-list') 
    const navigate = useNavigate()
    const{openSignUp}= useClerk();
    const {user} = useUser();
    
    return (
        <>
            <nav className="sticky top-0 left-0 w-full z-50 bg-blue-900 text-white px-4 sm:px-10 md:px-14  py-3">

                <div className="hidden md:flex justify-between items-center">
                    {/* Logo */}
                    <div onClick={() => navigate('/')} className="flex items-center   cursor-pointer">
                        <img src={assets.logo} alt="logo" className="w-10 sm:w-12" />
                        <h1 className="text-xl sm:text-2xl font-semibold">EduCrest</h1>
                    </div>
                    <div className="hidden md:flex gap-6 items-center">
                       
                            <ScrollLink smooth duration={500} offset={-70} className="cursor-pointer hover:text-yellow-400">About</ScrollLink>
                        <ScrollLink onClick={() => navigate('/course-list')} smooth duration={500} offset={-70} className="cursor-pointer hover:text-yellow-400">Course</ScrollLink>
                        <ScrollLink smooth duration={500} offset={-70} className="cursor-pointer hover:text-yellow-400">Contact</ScrollLink>
                         {user && <>
                        <ScrollLink onClick={() => navigate('/my-enrollments')} smooth duration={500} offset={-70} className="cursor-pointer hover:text-yellow-400">My Enrollments</ScrollLink>
                        <ScrollLink onClick={() => navigate('/educator')} smooth duration={500} offset={-70} className="cursor-pointer hover:text-yellow-400">Educator Dashboard</ScrollLink>
                        </>}    
                    </div>
                    {user ? (
                        <UserButton />
                    ) : (
                        <button
                            onClick={() => openSignUp()}
                            className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-white hover:text-black hover:bg-white transition-all'
                        >
                            Sign Up
                        </button>
                    )}
                </div>

                {/* For phone screens */}
                <div className='md:hidden flex items-center gap-5 sm:gap-5 text-white justify-between'>
                      <div onClick={() => navigate('/')} className="flex items-center   cursor-pointer">
                        <img src={assets.logo} alt="logo" className="w-10 sm:w-12" />
                        <h1 className="text-xl sm:text-2xl font-semibold">EduCrest</h1>
                    </div>
                     <div className=" flex  gap-5 justify-between items-center gap-1 sm:gap-2 max-sm:text-xs">
                        <ScrollLink onClick={() => navigate('/course-list')} smooth  className="cursor-pointer hover:text-yellow-400">Course</ScrollLink>
                        <ScrollLink smooth  className="cursor-pointer hover:text-yellow-400">Contact</ScrollLink>
                          {user && <>
                        <ScrollLink onClick={() => navigate('/my-enrollments')} smooth duration={500} offset={-70} className="cursor-pointer hover:text-yellow-400">My Enrollments</ScrollLink>
                        </>
                        }  
                    </div> 
                        {user ? (
                        <UserButton />
                    ) : (   
                        <button onClick={()=>openSignUp()}><img src={assets.user_icon} alt="user_icon" className='text-white' /></button>
                    )}
                    </div>
                    
                
            </nav>
        </>
    )
}

export default Navbar