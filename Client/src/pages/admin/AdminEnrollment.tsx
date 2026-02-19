import { useEffect, useState } from 'react'
import Loading from '../../component/student/Loading'
import { useAppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import AdminSidebar from '../../component/admin/AdminSidebar'

const AdminEnrollment = () => {

    const { backendUrl } = useAppContext()
    const [enrolledStudents, setEnrolledStudents] = useState<any[] | null>(null)
    const [courses, setCourses] = useState<any[]>([])

    // Modal State
    const [showModal, setShowModal] = useState(false)
    const [enrollEmail, setEnrollEmail] = useState('')
    const [selectedCourseId, setSelectedCourseId] = useState('')



    // Better approach for the list:
    // Fetch All Courses (which Admin can do).
    // Fetch All Users (Admin can do).
    // Map them Client Side.
    const fetchData = async () => {
        try {
            const [coursesRes, usersRes] = await Promise.all([
                axios.get(backendUrl + '/api/admin/courses'),
                axios.get(backendUrl + '/api/admin/users')
            ]);

            if (coursesRes.data.success) {
                setCourses(coursesRes.data.courses);
            }

            if (coursesRes.data.success && usersRes.data.success) {
                const allCourses = coursesRes.data.courses;
                const allUsers = usersRes.data.users;
                const mappedEnrollments: any[] = [];

                allUsers.forEach((user: any) => {
                    if (user.enrolledCourses && user.enrolledCourses.length > 0) {
                        user.enrolledCourses.forEach((courseId: string) => {
                            const course = allCourses.find((c: any) => c._id === courseId);
                            if (course) {
                                mappedEnrollments.push({
                                    student: user,
                                    courseTitle: course.courseTitle,
                                    date: new Date() // Placeholder as we don't have exact date in user object for enrollment
                                });
                            }
                        });
                    }
                });
                setEnrolledStudents(mappedEnrollments);
            }

        } catch (error: any) {
            toast.error(error.message);
        }
    }


    useEffect(() => {
        fetchData()
    }, [])

    const handleEnrollSubmit = async (e: any) => {
        e.preventDefault()
        if (!enrollEmail || !selectedCourseId) {
            toast.error('Please fill all fields')
            return
        }

        try {
            const { data } = await axios.post(backendUrl + '/api/admin/enroll-student', {
                email: enrollEmail.trim(),
                courseId: selectedCourseId
            })
            if (data.success) {
                toast.success(data.message)
                setShowModal(false)
                setEnrollEmail('')
                setSelectedCourseId('')
                fetchData() // Refresh list
            } else {
                toast.error(data.message)
            }
        } catch (error: any) {
            toast.error(error.message)
        }
    }


    return (
        <div className='min-h-screen flex bg-gray-50'>
            <AdminSidebar />
            <div className='flex-1 p-10'>
                <div className='flex justify-between items-center mb-8'>
                    <h1 className='text-3xl font-bold text-gray-800'>Enrollments</h1>
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
                                        {courses.map((course: any) => (
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

                <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
                    {!enrolledStudents ? <Loading /> : (
                        <div className="overflow-x-auto">
                            <table className='w-full text-left border-collapse'>
                                <thead className='text-gray-500 border-b border-gray-200'>
                                    <tr>
                                        <th className='p-3 text-sm font-medium'>S.NO</th>
                                        <th className='p-3 text-sm font-medium'>Student Name</th>
                                        <th className='p-3 text-sm font-medium'>Course Title</th>
                                        <th className='p-3 text-sm font-medium'>Email</th>
                                    </tr>
                                </thead>
                                <tbody className='text-gray-700 text-sm'>
                                    {enrolledStudents.length === 0 ? (
                                        <tr><td colSpan={4} className="p-4 text-center text-gray-400">No enrollments found</td></tr>
                                    ) : (
                                        enrolledStudents.map((item, index) => (
                                            <tr key={index} className='border-b border-gray-100 hover:bg-gray-50'>
                                                <td className='p-3 text-center'>{index + 1}</td>
                                                <td className='p-3 flex items-center gap-3'>
                                                    {/* Use a placeholder if imageUrl is missing */}
                                                    <img
                                                        src={item.student.imageUrl || "https://via.placeholder.com/30"} alt="Profile" className='w-8 h-8 rounded-full object-cover' />
                                                    <span className='font-medium'>{item.student.name}</span>
                                                </td>
                                                <td className='p-3'>{item.courseTitle}</td>
                                                <td className='p-3 text-gray-500'>{item.student.email}</td>
                                            </tr>
                                        ))
                                    )}

                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminEnrollment
