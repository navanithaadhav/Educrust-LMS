import { assets } from "../../assets/assets"


const Footeronly = () => {
  return (
    <div>
      <footer className='bg-gray-900 md:px-20 text-left w-full mt-10'>
         
          <div className='flex flex-col md:flex-row justify-center items-start md:items-center  gap-10 md:gap-32 px-8 md:px-0 py-10 text-white border-b border-white/30'>
          <div className='flex flex-col md:items-start items-center   w-full'> 
              <div onClick={() => navigate('/')} className="flex items-center  cursor-pointer">
                <img src={assets.logo} alt="logo" className="w-10 sm:w-12" />
                <h1 className="text-xl sm:text-2xl font-semibold">EduCrest</h1>
              </div>
              <p className='mt-2 text-center md:text-left text-sm text-white/80'>Empowering learners with flexible, accessible, and high-quality education through our powerful LMS platform.</p>
          </div>
          <div className='flex flex-col md:items-start items-center w-full'>
              <h2 className='text-lg font-semibold  '>Quick Links</h2>
              <ul className='text-sm  text-white/80'>
                  <li className='mt-2'><a href="#">Home</a></li>  
                  <li className='mt-2'><a href="#">About Us</a></li>
                  <li className='mt-2'><a href="#">Courses</a></li>   
                  <li className='mt-2'><a href="#">Contact Us</a></li>
              </ul>
          </div>
          <div className='hidden md:flex flex-col items-start   w-full'>
          <h2 className='font-semibold text-lg text-white mb-5'>Subscribe to our newsletter</h2>
          <p className='text-sm text-white/80'>The latest news,articles and resources, sent to your inbox weekly.</p>
          <div className='flex items-center gap-4 pt-4'>
              <input type="email" placeholder='Enter your email'
              className='border border-gray-500/80 rounded-md px-4 py-2 outline-none text-sm w-full md:w-64' />
              <button className=' border border-blue-500 bg-blue-500 px-4 py-1.5 rounded-md'>Subscribe</button>
          </div>
          </div>
          </div>
          <p className='py-4 text-center text-xs md:text-sm text-white/60'>Copyright 2025 © EduCrust.All Right Reserved</p>
         </footer>  
    </div>
  )
}

export default Footeronly