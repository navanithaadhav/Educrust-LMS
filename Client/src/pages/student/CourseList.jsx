import React, { use, useContext, useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'
import SearchBar from '../../component/student/SearchBar'
import Card from '../../component/student/Card'
import Footer from '../../component/student/Footer'
import Footeronly from '../../component/student/Footeronly'

const CourseList = () => {
  const navigate = useNavigate()
  const { input} =useParams()
  const {allCourses} = useContext(AppContext)
  const [filteredCourses, setFilteredCourses] = useState([])

  useEffect(()=>{
    if (allCourses && allCourses.length > 0) {
      const tempCourse=allCourses.slice()

      input ? 
        setFilteredCourses(tempCourse.filter(course => course.courseTitle.toLowerCase().includes(input.toLowerCase())))
      :setFilteredCourses(tempCourse)
    }
  },[allCourses,input])
  
  return (
    <>
      <div className='relative md:px-15 px-28 pt-26 -mt-15 text-left'>
        <div className='flex md:flex-row flex-col items-start justify-between w-full gap-6'>
          <div>
          <h1 className='text-4xl font-semibold text-gray-800'>Course List </h1>
          <p className='text-gray-500 '>
            <span onClick={()=>navigate('/')} className='text-blue-600 cursor-pointer'>Home</span>/<span>Course List</span>
          </p>
        </div>
       <SearchBar data={input} />
      </div>

      {
        input && <div className='inline-flex items-center border rounded gap-4 px-6 py-2  mt-8 -mb-8 text-gray-600 '> 
          <p>{input}</p>
          <img src={assets.cross_icon} alt="cross_icon" onClick={()=>navigate('/course-list')} className='' />
        </div>
      }
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 my-16 px-2 md:p-0'>
      {filteredCourses.map((course,index) => <Card key={index} course={course}/>
    )}
      </div>
      </div>
      <Footeronly />
    </>
  )
}

export default CourseList