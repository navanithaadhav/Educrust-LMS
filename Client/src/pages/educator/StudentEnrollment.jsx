import React, { useContext, useEffect, useState } from 'react'
import { dummyStudentEnrolled } from '../../assets/assets'
import Loading from '../../component/student/Loading'
import { AppContext } from '../../context/AppContext'

const StudentEnrollment = () => {

  // const { currency, allCourses } = useContext(AppContext)
  // const [courses, setCourses] = useState(null)
  const [enrolledStudents, setEnrolledStudents] = useState()

  const fetchStudentEnrolled = async () => {
    setEnrolledStudents(dummyStudentEnrolled)
  }
  useEffect(() => {
    fetchStudentEnrolled()
  }, [])

  return enrolledStudents ? (
    <div className='min-h-screen flex flex-col items-start justify-start  md:p-8 md:pb-0 p-4 pt-8 pb-0'>
      <h1 className='text-gray-900 font-medium'>Student Enrolled </h1>
      <div className='flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20 shadow-card mt-8'>
        <table className='md:table-auto w-full overflow-hidden table-fixed'>
          <thead className='text-gray-900 border-b border-gray-500/30 text-sm text-left'>
            <tr>
              <th className='px-4 py-3 font-semibold truncate'>S.NO</th>
              <th className='px-4 py-3 font-semibold truncate'>Student Name</th>
              <th className='px-4 py-3 font-semibold truncate'>Course Title</th>
              <th className='px-4 py-3 font-semibold truncate'>Date</th>
            </tr>
          </thead>
          <tbody className='text-gray-700 text-sm'>
            {enrolledStudents.map((item, index) => (
              <tr key={index} className='border-b border-gray-500/30 hover:bg-gray-100'>
                <td className='px-4 py-3 text-center hidden sm:table-cell'>{index + 1}</td>
                <td className='md:px-4 px-2 py-3 flex items-center space-x-3'>
                  <img
                    src={item.student.imageUrl} alt="Profile" className='w-9 h-9 rounded-full' />
                  <span className='truncate'>{item.student.name}</span>
                </td>
                <td className='px-4 py-3 truncate'>{item.courseTitle}</td>
                <td className='px-4 py-3 hidden sm:table-cell'>{new Date(item.purchaseDate).toLocaleDateString()}</td>
              </tr>
            
            ))}

          </tbody>
        </table>
      </div>
    </div>
  ) :
    <Loading />
}

export default StudentEnrollment