import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets, dummyTestimonial } from '../../assets/assets'

const TestimonialSection = () => {
    const { testimonial } = useContext(AppContext)
    return (
        <div className='py-8 md:px-40 px-8 flex flex-col justify-center items-center mb-20'>
            <h2 className='text-3xl text-center font-medium text-gray-800'>Testimonials</h2>
            <p className='text-sm text-center md:text-base text-gray-500 mt-3'>Here from our learners as they share their journeys of transformation,success and how our<br /> platform has made a difference in their lives </p>
            <div className='grid auto  px-4 md:px-0  md:my-16 my-10 gap-8 mt-14'>
                {dummyTestimonial.map((testimonial, index) => (
                    <div key={index} className='text-sm  test-left border border-gray-500/30 pb-6 rounded-lg bg-white shadow-[0px_4px_15px_0px] shadow-black/5 overfkow-hidden'>
                        <div className='flex items-center  gap-4 px-5 py-4 bg-gray-100'>
                            <img className='h-12 w-12 rounded-full' src={testimonial.image} alt={testimonial.name} />
                       
                        <div >
                            <h1 className='text-lg font-medium text-gray-800'>{testimonial.name} </h1>
                            <p className='text-gray-800/80'>{testimonial.role}</p>
                        </div>
                     </div>
                       <div className='p-5 pb-7'>
                            <div className='flex gap-0.5'>
                                {[...Array(5)].map((_, i) => (
                                    <img key={i} src={i < Math.floor(testimonial.rating) ? assets.star : assets.star_blank} alt='star' className='h-4 ' />
                                ))}
                            </div>
                            <p className='text-gray-500 mt-5'>{testimonial.feedback}</p>
                        </div>
                        <a href="#" className='text-blue-500 underline px-5'>Read More</a>
                    </div> 
                ))}

        </div>
    </div >
    )
}

export default TestimonialSection