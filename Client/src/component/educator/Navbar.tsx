import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const Navbar = () => {

  const navigate = useNavigate();
  const { userData } = useAppContext();

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
          <p>Hi! {userData ? userData.name : 'Developers'}</p>
          {userData?.imageUrl ? <img src={userData.imageUrl} className='w-8 h-8 rounded-full' alt="pfp" /> : <img src={assets.profile_img} alt="user icon" className="w-8 h-8 rounded-full" />}
        </div>
      </div>
    </div>

  )
}

export default Navbar