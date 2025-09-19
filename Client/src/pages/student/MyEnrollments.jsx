import React, { useContext,useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { useNavigate } from 'react-router-dom'
import {Line} from 'rc-progress'
import Footeronly from '../../component/student/Footeronly'

const MyEnrollments = () => {
  const navigate = useNavigate()
  const { enrolledCourses,calculateCourseDuration, } = useContext(AppContext)
  const [progressArray, setProgressArray] = useState([
    {lecturesCompleted: 2, totalLectures: 4},
    {lecturesCompleted: 1, totalLectures: 5},
    {lecturesCompleted: 3, totalLectures: 6},
    {lecturesCompleted: 4, totalLectures: 4},
    {lecturesCompleted: 0, totalLectures: 3},
    {lecturesCompleted: 5, totalLectures: 7},
    {lecturesCompleted: 6, totalLectures: 8},
    {lecturesCompleted: 2, totalLectures: 6},
    {lecturesCompleted: 4, totalLectures: 10},
    {lecturesCompleted: 3, totalLectures: 5},     
    {lecturesCompleted: 7, totalLectures: 7},
    {lecturesCompleted: 1, totalLectures: 4},
    {lecturesCompleted: 0, totalLectures: 2},
    {lecturesCompleted: 5, totalLectures: 5},
]);
  return (
    <>
    <div className='md:px-15 px-8 pt-10'>
      <h1 className='text-2xl font-semibold'>MyEnrollments</h1>
      <table className='md:table-auto table-fixed w-full mt-10 overflow-hidden border'>
        <thead className='text-gray-900 border border-gray-500/30 text-lg text-left max-sm:hidden'>
          <tr>
            <th className='px-4 py-3 font-semibold truncate'>Course</th>
            <th className='px-4 py-3 font-semibold truncate'>Duration</th>
            <th className='px-4 py-3 font-semibold truncate'>Completed</th>
            <th className='px-4 py-3 font-semibold truncate'>Status</th>
          
          </tr>
        </thead >
        <tbody className='text-gray-700 '>
          {enrolledCourses.map((course, index) => (
            <tr key={index} className='border border-gray-500/30'>
              <td className='md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3'>
              <img src={course.courseThumbnail} alt='thumbnail' className='w-14 sm:w-24 md:w-28' />
              <div className='flex-1'>
                <p className='mb-1 max-sm:text-sm'>{course.courseTitle}</p>
                <Line percent={progressArray[index] ? (progressArray[index].lecturesCompleted * 100 / progressArray[index].totalLectures)  : 0} strokeWidth={2} className='bg-gray-300 rounded-full' />
              </div>
              </td>
              <td className='px-4 py-3 max-sm:hidden'>
                {calculateCourseDuration(course)}
              </td>
              <td className='px-4 py-3 max-sm:hidden'>
               {progressArray[index] && `${
                  progressArray[index].lecturesCompleted} / ${progressArray[index].totalLectures
               }`}<span>Lectures</span>
              </td>
              <td className='px-4 py-3 max-sm:text-right'>
                <button className='px-3 sm:px-5 -y-1.5 sm:py-2 bg-blue-600 max-sm:text-xs rounded text-white' onClick={() => navigate('/player/' + course._id)}>
                  {progressArray[index] && progressArray[index].lecturesCompleted / progressArray[index].totalLectures === 1 ? 'Completed' : 'On Going'
                  }</button>
              </td>
              </tr>
              ))}
        </tbody>
      </table>
     
    </div>
     <Footeronly />
    </>
  )
}

export default MyEnrollments