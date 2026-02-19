import { useEffect, useState } from 'react'
import Loading from '../../component/student/Loading'
import { useAppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const StudentEnrollment = () => {

  const { backendUrl, educatorCourses, fetchEducatorCourses } = useAppContext()
  const [enrolledStudents, setEnrolledStudents] = useState<any[] | null>(null)

  // Modal State
  const [showModal, setShowModal] = useState(false)
  const [enrollEmail, setEnrollEmail] = useState('')
  const [selectedCourseId, setSelectedCourseId] = useState('')

  const fetchStudentEnrolled = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/educator/enrolled-students')
      if (data.success) {
        setEnrolledStudents(data.enrolledStudents)
      } else {
        toast.error(data.message)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchStudentEnrolled()
    fetchEducatorCourses()
  }, [])

  const handleEnrollSubmit = async (e: any) => {
    e.preventDefault()
    if (!enrollEmail || !selectedCourseId) {
      toast.error('Please fill all fields')
      return
    }

    try {
      const { data } = await axios.post(backendUrl + '/api/educator/enroll-student', {
        email: enrollEmail,
        courseId: selectedCourseId
      })
      if (data.success) {
        toast.success(data.message)
        setShowModal(false)
        setEnrollEmail('')
        setSelectedCourseId('')
        fetchStudentEnrolled() // Refresh list
      } else {
        toast.error(data.message)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }


  return enrolledStudents ? (
    <div className='min-h-screen flex flex-col items-start justify-start  md:p-8 md:pb-0 p-4 pt-8 pb-0'>
      <div className='flex justify-between items-center w-full max-w-4xl'>
        <h1 className='text-gray-900 font-medium'>Student Enrolled </h1>
        <button
          onClick={() => setShowModal(true)}
          className='bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition'
        >
          Enroll New User
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-lg w-full max-w-md'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-lg font-bold'>Enroll Student Manually</h2>
              <button onClick={() => setShowModal(false)} className='text-gray-500 hover:text-gray-700'>&times;</button>
            </div>
            <form onSubmit={handleEnrollSubmit} className='flex flex-col gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Student Email</label>
                <input
                  type="email"
                  value={enrollEmail}
                  onChange={(e) => setEnrollEmail(e.target.value)}
                  className='w-full border border-gray-300 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500'
                  placeholder='student@example.com'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Select Course</label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className='w-full border border-gray-300 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500'
                  required
                >
                  <option value="">-- Select Course --</option>
                  {educatorCourses && educatorCourses.map((course: any) => (
                    <option key={course._id} value={course._id}>{course.courseTitle}</option>
                  ))}
                </select>
              </div>
              <button type='submit' className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-2'>
                Enroll User
              </button>
            </form>
          </div>
        </div>
      )}

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