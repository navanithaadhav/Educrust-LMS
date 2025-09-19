import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import Card from './Card'


const CourseSection = () => {

const {allCourses}=useContext(AppContext)

  return (
    <div className=' py-16 md:px-40 px-8 flex flex-col justify-center items-center'>
        <h2 className='text-3xl text-center font-medium text-gray-800'>Learn from the best</h2>
        <p className='text-sm text-center md:text-base text-gray-500 mt-3'>Discover our top-rated courses across various categories.From coding and design to<br /> business and 
         wellness,our courses are crafted to deliver results
        </p>
        <div className='grid auto  px-4 md:px-0  md:my-16 my-10 gap-6'>
        {allCourses.slice(0,4).map((course,index)=><Card key={index} course={course} />)}
        </div>
        <Link to={'/course-list'} onClick={()=>{scrollTo(0,0)}} className='text-gray-800  border border-gray-500/30  px-10 py-3 rounded'>Show all courses</Link>
    </div>
  )
}

export default CourseSection