import { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import AdminSidebar from '../../component/admin/AdminSidebar'

const AdminCourses = () => {
    const navigate = useNavigate()
    const { backendUrl, currency, deleteCourse } = useAppContext()
    const [courses, setCourses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAllCourses()
    }, [])

    const fetchAllCourses = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/courses')
            if (data.success) {
                setCourses(data.courses)
            } else {
                toast.error(data.message)
            }
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen flex bg-gray-50'>
            <AdminSidebar />

            <div className='flex-1 p-10'>
                <h1 className='text-3xl font-bold text-gray-800 mb-8'>All Courses</h1>
                <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
                    {loading ? <p>Loading...</p> : (
                        <div className='overflow-x-auto'>
                            <table className='w-full text-left border-collapse'>
                                <thead>
                                    <tr className='border-b border-gray-200'>
                                        <th className='p-3 text-sm font-medium text-gray-500'>Title</th>
                                        <th className='p-3 text-sm font-medium text-gray-500'>Educator</th>
                                        <th className='p-3 text-sm font-medium text-gray-500'>Price</th>
                                        <th className='p-3 text-sm font-medium text-gray-500'>Category</th>
                                        <th className='p-3 text-sm font-medium text-gray-500'>Published</th>
                                        <th className='p-3 text-sm font-medium text-gray-500'>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.map((course: any) => (
                                        <tr key={course._id} className='border-b border-gray-100 hover:bg-gray-50'>
                                            <td className='p-3 flex items-center gap-3'>
                                                <img src={course.courseThumbnail} alt="" className='w-16 h-10 rounded object-cover' />
                                                <span className='font-medium text-gray-800 truncate w-64 block'>{course.courseTitle}</span>
                                            </td>
                                            <td className='p-3 text-gray-600'>{course.educator?.name || 'Unknown'}</td>
                                            <td className='p-3 text-gray-600'>{currency}{course.coursePrice}</td>
                                            <td className='p-3 text-gray-600'>{course.courseCategory || 'N/A'}</td>
                                            <td className='p-3'>
                                                <span className={`px-2 py-1 rounded text-xs ${course.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                    {course.isPublished ? 'Published' : 'Draft'}
                                                </span>
                                            </td>
                                            <td className='p-3'>
                                                <button className='px-2 py-1 bg-blue-500 text-white rounded mr-2' onClick={() => navigate('/admin/edit-course/' + course._id)}>Edit</button>
                                                <button className='px-2 py-1 bg-red-500 text-white rounded' onClick={() => { if (window.confirm('Are you sure you want to delete this course?')) deleteCourse(course._id, 'admin') }}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminCourses
