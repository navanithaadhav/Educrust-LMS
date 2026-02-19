import { assets } from '../../assets/assets'
import { motion } from 'framer-motion'
import CourseSection from './CourseSection'
import TestimonialSection from './TestimonialSection'
import Footer from './Footer'
import SearchBar from './SearchBar'
import About from '../../pages/student/About'

const Header = () => {

  const companies = [
    { id: 1, name: "Microsoft", logo: assets.microsoft_logo },
    { id: 2, name: "Walmart", logo: assets.walmart_logo },
    { id: 3, name: "Accenture", logo: assets.accenture_logo },
    { id: 4, name: "Adobe", logo: assets.adobe_logo },
    { id: 5, name: "PayPal", logo: assets.paypal_logo },
  ]

  return (
    <div className="relative overflow-hidden bg-slate-50/50">

      {/* Background Animated Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
      <div className="absolute top-[-10%] right-[-20%] w-[600px] h-[600px] bg-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000"></div>

      <section className="relative z-10 h-auto pb-20 px-4 md:px-8 lg:px-14 mx-auto flex flex-col md:flex-row items-center justify-between gap-10 md:gap-8 lg:gap-20 pt-0 md:pt-0">

        {/* Left Column - Text Content */}
        <motion.div
          className="flex flex-col w-full md:w-1/2 justify-center items-center md:items-start text-center md:text-left z-10"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className="my-4 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 tracking-tight">
              Rise Higher with <br className="hidden md:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative inline-block mt-2">
                EduCrest
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-blue-400 opacity-40 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </h1>
          </motion.div>

          <motion.p
            className="leading-relaxed text-lg md:text-xl mb-8 max-w-lg text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Unlock expert-led courses, real-world skills, and career-boosting certifications all in one place.
          </motion.p>

          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <SearchBar />
          </motion.div>
        </motion.div>

        {/* Right Column - Hero Image & Floating Elements */}
        <motion.div
          className="w-full md:w-1/2 relative z-10 flex justify-center mt-10 md:mt-0"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="relative w-80 sm:w-full max-w-md">
            {/* Main Image with subtle float */}
            <motion.img
              className="w-full h-auto object-contain relative z-10 drop-shadow-2xl"
              src={assets.image}
              alt="Student"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Floating Glassmorphism Cards */}
            {/* Calendar - Top Left */}
            <motion.div
              className="absolute -top-6 -left-5 sm:top-10 sm:-left-12 z-20 backdrop-blur-md bg-white/90 border border-white/60 p-4 rounded-3xl shadow-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0, y: [0, 15, 0] }}
              transition={{
                opacity: { delay: 0.8, duration: 0.5 },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <img className="w-20 sm:w-24 object-contain" src={assets.calendar} alt="Calendar" />
            </motion.div>

            {/* UX - Bottom Left */}
            <motion.div
              className="absolute bottom-10 -left-5 sm:bottom-20 sm:-left-12 z-20 backdrop-blur-md bg-white/90 border border-white/60 p-4 rounded-3xl shadow-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0, y: [0, -12, 0] }}
              transition={{
                opacity: { delay: 1, duration: 0.5 },
                y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
              }}
            >
              <img className="w-20 sm:w-24 object-contain" src={assets.ux} alt="UX" />
            </motion.div>

            {/* Congrat - Bottom Right */}
            <motion.div
              className="absolute top-[60%] -right-3 sm:top-[50%] sm:-right-8 z-20 backdrop-blur-md bg-white/90 border border-white/60 p-4 rounded-3xl shadow-xl"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0, y: [0, 10, 0] }}
              transition={{
                opacity: { delay: 1.2, duration: 0.5 },
                y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }
              }}
            >
              <img className="w-24 sm:w-32 object-contain" src={assets.congrat} alt="Congratulation" />
            </motion.div>
          </div>
        </motion.div>
      </section >

      {/* Modern Infinite Marquee Section */}
      <div className="bg-white/80 backdrop-blur-sm py-12 border-y border-gray-100">
        <h2 className="text-xl md:text-2xl font-semibold text-center text-gray-500 mb-8 tracking-wide">
          Trusted by learners from leading companies
        </h2>

        <div className="relative flex overflow-hidden w-full group mask-linear-gradient">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10"></div>

          <div className="flex shrink-0 gap-16 animate-marquee min-w-full items-center justify-around px-8">
            {[...companies, ...companies].map((company, index) => (
              <div key={index} className="flex items-center justify-center min-w-[100px] grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300 transform hover:scale-110 cursor-pointer">
                <img src={company.logo} alt={company.name} className="h-8 md:h-9 w-auto object-contain" />
              </div>
            ))}
          </div>

          <div className="flex shrink-0 gap-16 animate-marquee min-w-full items-center justify-around px-8" aria-hidden="true">
            {[...companies, ...companies].map((company, index) => (
              <div key={index} className="flex items-center justify-center min-w-[100px] grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300 transform hover:scale-110 cursor-pointer">
                <img src={company.logo} alt={company.name} className="h-8 md:h-9 w-auto object-contain" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <About />
      <CourseSection />
      <TestimonialSection />
      <Footer />
    </div>
  );
}

export default Header