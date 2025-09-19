import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import Loading from '../../component/student/Loading'

const MyCourses = () => {

const{currency,allCourses} = useContext(AppContext)
const [courses,setCourses]=useState(null)

const fetchEducatorCourses= async ()=>{
  setCourses(allCourses)
}
 useEffect(() => {
    fetchEducatorCourses();
  }, []);


  return courses ? (
    <div className='min-h-screen flex flex-col items-start justify-between  md:p-8 md:pb-0 p-4 pt-8 pb-0'>
<div className='w-full'>
  <h2 className='pb-4 text-lg font-medium'>My Courses</h2>
  <div className='flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20 shadow-card'>
    <table className='md:table-auto w-full overflow-hidden table-fixed'>
      <thead className='text-gray-900 border-b border-gray-500/30 text-sm text-left'>
        <tr>
          <th className='px-4 py-3 font-semibold truncate'>All Courses</th>
          <th className='px-4 py-3 font-semibold truncate'>Earning</th>
          <th className='px-4 py-3 font-semibold truncate'>Students</th>
          <th className='px-4 py-3 font-semibold truncate'>Published On</th>
        </tr>
      </thead>
      <tbody className='text-gray-700 text-sm'>
        {courses.map((course) => (
          <tr key={course._id} className='border-b border-gray-500/30 hover:bg-gray-100'>
            <td className='md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate'>
              <img src={course.courseThumbnail} alt="course image" className='w-16' />
              <span className='truncade md:block hidden'>{course.courseTitle}</span>
            </td>
            <td className='px-4 py-3'>{currency}{ Math.floor(course.enrolledStudents.length * (course.coursePrice - (course.discount * course.coursePrice) / 100)).toFixed(2)}</td>
            <td className='px-4 py-3'>{course.enrolledStudents.length}</td>
            <td className='px-4 py-3'>{new Date(course.createdAt).toLocaleDateString()}</td>
          </tr>
        ))}

      </tbody>
    </table>
  </div>
</div>
    </div>
  ):<Loading/>

}

export default MyCourses