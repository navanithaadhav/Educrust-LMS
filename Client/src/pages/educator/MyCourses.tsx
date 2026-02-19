import { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import Loading from '../../component/student/Loading'
import { Course } from '../../types'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const MyCourses = () => {

  const { currency, educatorCourses, fetchEducatorCourses, deleteCourse, backendUrl, updateCourse } = useAppContext()
  const [courses, setCourses] = useState<Course[] | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchEducatorCourses()
  }, [])

  useEffect(() => {
    if (educatorCourses) {
      setCourses(educatorCourses)
    }
  }, [educatorCourses])


  return courses ? (
    <div className='min-h-screen flex flex-col items-start justify-between  md:p-8 md:pb-0 p-4 pt-8 pb-0'>
      <div className='w-full'>
        <div className="flex justify-between items-center pb-4">
          <h2 className='text-lg font-medium'>My Courses</h2>
          <button onClick={async () => {
            try {
              const { data } = await axios.post(backendUrl + '/api/course/seed')
              if (data.success) {
                toast.success(data.message)
                fetchEducatorCourses()
              } else {
                toast.error(data.message)
              }
            } catch (error: any) {
              toast.error(error.message)
            }
          }} className="px-3 py-1.5 bg-green-600 text-white rounded text-sm">Seed Database (Dev)</button>
        </div>
        <div className='flex flex-col items-center max-w-4xl w-full rounded-md bg-white border border-gray-500/20 shadow-card'>
          <table className='md:table-auto w-full overflow-x-auto table-fixed'>
            <thead className='text-gray-900 border-b border-gray-500/30 text-sm text-left'>
              <tr>
                <th className='px-4 py-3 font-semibold truncate'>All Courses</th>
                <th className='px-4 py-3 font-semibold truncate'>Earning</th>
                <th className='px-4 py-3 font-semibold truncate'>Students</th>

                <th className='px-4 py-3 font-semibold truncate'>Published On</th>
                <th className='px-4 py-3 font-semibold truncate'>Status</th>
                <th className='px-4 py-3 font-semibold truncate'>Action</th>
              </tr>
            </thead>
            <tbody className='text-gray-700 text-sm'>
              {courses.map((course) => (
                <tr key={course._id} className='border-b border-gray-500/30 hover:bg-gray-100'>
                  <td className='md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate'>
                    <img src={course.courseThumbnail} alt="course image" className='w-16' />
                    <span className='truncade md:block hidden'>{course.courseTitle}</span>
                  </td>
                  <td className='px-4 py-3'>{currency}{Math.floor((course.enrolledStudents?.length || 0) * (course.coursePrice - (course.discount * course.coursePrice) / 100)).toFixed(2)}</td>
                  <td className='px-4 py-3'>{course.enrolledStudents?.length || 0}</td>
                  <td className='px-4 py-3'>{new Date(course.createdAt).toLocaleDateString()}</td>
                  <td className='px-4 py-3'>
                    <button
                      className={`px-2 py-1 rounded text-white text-xs ${course.isPublished ? 'bg-green-500' : 'bg-gray-500'}`}
                      onClick={() => updateCourse(course._id, { isPublished: !course.isPublished }, null)}
                    >
                      {course.isPublished ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className='px-4 py-3 truncate'>
                    <button className='px-2 py-1 bg-blue-500 text-white rounded mr-2' onClick={() => navigate(`/educator/add-course?id=${course._id}`)}>Edit</button>
                    <button className='px-2 py-1 bg-red-500 text-white rounded' onClick={() => { if (window.confirm('Are you sure you want to delete this course?')) deleteCourse(course._id, 'educator') }}>Delete</button>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : <Loading />

}

export default MyCourses