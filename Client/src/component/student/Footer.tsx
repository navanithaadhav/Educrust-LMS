import { useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { FaWhatsapp } from 'react-icons/fa'

const Footer = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')

  const handleConnect = () => {
    window.open('https://wa.me/918778543730', '_blank');
  }

  const handleSubscribe = () => {
    if (!email || !email.includes('@')) {
      toast.error("Please enter a valid email")
      return
    }
    toast.success("Subscribed successfully!")
    setEmail('')
  }

  return (
    <footer className='bg-[#0F172A] w-full mt-32 relative text-white'>

      {/* Floating CTA Banner */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[80%] max-w-6xl mx-auto z-20">
        <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img src="/footer.png" alt="background" className="w-full h-full object-cover opacity-90" loading="lazy" decoding="async" />
            {/* Gradient for text readability if needed */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
          </div>

          <div className="relative z-10 px-8 py-10 md:py-14 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
            <div className='md:pl-8'>
              <p className="text-lg md:text-xl font-medium text-white drop-shadow-md mb-2">
                Couldn't find what you looking?
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Connect with us Right Away.
              </h2>
            </div>
            <div className='md:pr-8'>
              <button
                onClick={handleConnect}
                className="bg-blue-800 hover:bg-blue-700 text-white text-lg font-semibold px-8 py-4 rounded-xl shadow-lg transition-transform transform hover:scale-105 active:scale-95 ring-4 ring-blue-700/20 flex items-center gap-2">
                <FaWhatsapp className='text-2xl' />
                Connect with Counsellor
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Content */}
      <div className="pt-40 pb-10 px-6 md:px-14 lg:px-20 mx-auto max-w-7xl">
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8'>

          {/* Column 1: Brand & Desc */}
          <div className='flex flex-col items-start'>
            <div onClick={() => navigate('/')} className="flex items-center gap-3 cursor-pointer group">
              {/* Assuming logo might need a white version or filter for dark bg if it's dark text */}
              <img src={assets.logo} alt="EduCrest" className="w-8 md:w-10 opacity-90 group-hover:opacity-100 transition-opacity filter brightness-[100]" width="40" height="40" />
              {/* Wait, simple approach: just render logo. If it's black logo on dark bg it won't show. I'll add brightness-200 or invert if needed or rely on text */}
              <h1 className="text-2xl md:text-3xl font-bold tracking-wide">EduCrest</h1>
            </div>
            <p className='mt-6 text-slate-300 leading-relaxed max-w-xs text-sm md:text-base'>
              Empowering learners with flexible, accessible, and high-quality education through our powerful LMS platform.
            </p>
            <div className='mt-6 text-slate-300 text-sm md:text-base leading-relaxed'>
              <p className="font-semibold text-white mb-1">Our Address:</p>
              <p>123, VOC Street,</p>
              <p>R.S. Puram,</p>
              <p>Coimbatore, Tamil Nadu 641002</p>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className='flex flex-col items-start md:items-center lg:items-center w-full'>
            <div className='text-left'>
              <h2 className='text-xl font-bold mb-6 text-white'>Quick Links</h2>
              <ul className='space-y-4 text-slate-300'>
                <li><a href="#" className='hover:text-blue-400 transition-colors duration-200'>Home</a></li>
                <li><span onClick={() => navigate('/about')} className="cursor-pointer hover:text-blue-400 transition-colors duration-200">About Us</span></li>
                <li><a href="#" className='hover:text-blue-400 transition-colors duration-200'>Courses</a></li>
                <li><a href="#" className='hover:text-blue-400 transition-colors duration-200'>Contact Us</a></li>
              </ul>
            </div>
          </div>

          {/* Column 3: Newsletter */}
          <div className='flex flex-col w-full'>
            <h2 className='text-xl font-bold mb-4 text-white'>Subscribe to our newsletter</h2>
            <p className='text-slate-300 text-sm mb-6 max-w-sm'>
              The latest news, articles and resources, sent to your inbox weekly.
            </p>
            <div className='flex gap-3 w-full max-w-md'>
              <input
                type="email"
                placeholder='Enter your email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full px-4 py-3 rounded-lg text-gray-800 bg-white border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition'
              />
              <button
                onClick={handleSubscribe}
                className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow-md whitespace-nowrap'>
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className='mt-16 pt-8 border-t border-slate-700/50 text-center'>
          <p className='text-slate-400 text-sm'>
            Copyright 2025 ® EduCrest. All Right Reserved
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer