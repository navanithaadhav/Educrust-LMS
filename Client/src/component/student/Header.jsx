
import { assets } from '../../assets/assets'
import { motion } from 'framer-motion'
import CourseSection from './CourseSection'
import TestimonialSection from './TestimonialSection'
import CallToAction from './CallToAction'
import Footer from './Footer'
import SearchBar from './SearchBar'
import Connectus from './Connectus'

const Header = () => {
 
  
  
  

  const companies = [
    { id: 1, logo: assets.microsoft_logo },
    { id: 1, logo: assets.walmart_logo },
    { id: 1, logo: assets.accenture_logo},
    { id: 1, logo: assets.adobe_logo },
    { id: 1, logo: assets.paypal_logo},
    
  ]
  const stats = [
    { from: 0, to: 150, label: "Customers" },
    { from: 0, to: 2000, label: "Sales" },
    { from: 0, to: 100, label: "Products" },
    { from: 0, to: 50, label: "Awards" },
  ];

  return (

    <>
      <section className="h-screen px-18 mx-auto flex flex-col lg:flex-row items-start bg-slate-200 ">
        {/* Left Column */}
        <div className="flex flex-col w-full lg:w-8/12 justify-center lg:pt-44 items-start text-center md:text-left mb-5 lg:mb-0">
          <h1 className="my-4  text-4xl font-bold leading-tight text-darken"> Rise Higher with
            <span className="text-blue-800 text-5xl relative"> <span className='absolute lg:-left-2 lg:-top-6  top-7 -left-63'>🎓</span>EduCrest</span>
          </h1>
          <p className="leading-normal text-2xl mb-8">
            Unlock expert-led courses, real-world skills, and career boosting certifications all in one place.
          </p>
         <SearchBar />
        </div>
        {/* Right Column */}
        
        <motion.div
        className="w-full md:w-8/16 mt-8 relative"
          initial={{ y: 100 }} // Start 100px below
          animate={{ y: 0 }}    // Animate to original position (0)
          transition={{ type: "spring", stiffness: 80 }}
        >
          <img
            className="w-10/12 mx-auto 2xl:-mb-10"
            src={assets.image}
            alt="Girl"
          />
       </motion.div>
        {/* Floating images, SVGs can also be separate child components */}
        <motion.div
          className="absolute top-110 left-6 sm:top-32 sm:left-2 md:top-80 md:left-20 lg:left-160 lg:top-42"
          initial={{ y: 100 }} 
          animate={{
            y: [0, 10, 0], // Smooth float up and down
          }}
          transition={{
            duration: 1,           // Slow it down for smoothness
            repeat: Infinity,      // Keep looping
            repeatType: "loop",
            ease: "easeIn",     // Smooth easing
          }}
        >
          <img
            className="bg-white bg-opacity-80 rounded-lg h-12 sm:h-16"
            src={assets.calendar}
            alt="Calendar"
          />
        </motion.div>


        {/* ux class */}
        <motion.div
         className="absolute bottom-8 left-1 sm:left-2 sm:bottom-20 lg:bottom-20 lg:left-150 floating"
         initial={{y:100}}
          animate={{
            y: [0, 10, 0], // Smooth float up and down
          }}
          transition={{
            duration: 2,           // Slow it down for smoothness
            repeat: Infinity,      // Keep looping
            repeatType: "loop",
            ease:"easeIn"
            // ease: "easeInOut",     // Smooth easing
          }}
        >
          <img className="bg-white bg-opacity-80 rounded-lg h-20 sm:h-28" src={assets.ux} alt="" />
        </motion.div>
          
        {/* congrats */}
         <motion.div
          className="absolute bottom-20 md:bottom-48 lg:bottom-52 -right-6 lg:right-8 floating-4"
          initial={{ y: 100 }} 
          animate={{
            y: [0, 10, 0], // Smooth float up and down
          }}
          transition={{
            duration: 1,           // Slow it down for smoothness
            repeat: Infinity,      // Keep looping
            repeatType: "loop",
            ease: "easeIn",     // Smooth easing
          }}
        >
          <img
            className="bg-white bg-opacity-80 rounded-lg h-12 sm:h-16"
            src={assets.congrat}
            alt="Calendar"
          />
        </motion.div>
    </section >
      <div className="bg-white  py-12 px-4 md:px-10 lg:px-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800  mb-10">
          Trusted by learners from
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-10 items-center justify-center ">
          {companies.map((company, index) => (
            <div
              key={index}
              className="flex justify-center items-center  p-3 md:p-4 bg-white hover:bg-blue-100 rounded-xl shadow transition-transform duration-300 hover:scale-105"
            >
              <img
                src={company.logo}
                alt={company.name}
                className="h-10 md:h-12 w-20 md:w-28 object-contain"
                title={company.name}
              />
            </div>
          ))}
        </div>
      </div>
      
      <CourseSection />
      <TestimonialSection />
      {/* <CallToAction />
      <Connectus /> */}
      
      <Footer />
    </>
  );
}



export default Header