import { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import AdminSidebar from '../../component/admin/AdminSidebar'
import Loading from '../../component/student/Loading'
import Rating from '../../component/student/Rating'

const AdminReviews = () => {

    const { backendUrl } = useAppContext()
    const [reviews, setReviews] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Edit Modal State
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedReview, setSelectedReview] = useState<any | null>(null)
    const [newRating, setNewRating] = useState(0)


    const fetchReviews = async () => {
        setIsLoading(true)
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/reviews')
            if (data.success) {
                setReviews(data.reviews)
            } else {
                toast.error(data.message)
            }
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchReviews()
    }, [])

    const handleDelete = async (courseId: string, userId: string) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;

        try {
            const { data } = await axios.post(backendUrl + '/api/admin/delete-review', { courseId, userId })
            if (data.success) {
                toast.success(data.message)
                fetchReviews()
            } else {
                toast.error(data.message)
            }
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    const openEditModal = (review: any) => {
        setSelectedReview(review)
        setNewRating(review.rating)
        setShowEditModal(true)
    }

    const handleUpdate = async () => {
        if (!selectedReview) return;

        try {
            const { data } = await axios.post(backendUrl + '/api/admin/update-review', {
                courseId: selectedReview.courseId,
                userId: selectedReview.user._id,
                rating: newRating
            })
            if (data.success) {
                toast.success(data.message)
                setShowEditModal(false)
                fetchReviews()
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
                <h1 className='text-3xl font-bold text-gray-800 mb-8'>All Reviews</h1>

                <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
                    {isLoading ? <Loading /> : (
                        <div className="overflow-x-auto">
                            <table className='w-full text-left border-collapse'>
                                <thead className='text-gray-500 border-b border-gray-200'>
                                    <tr>
                                        <th className='p-3 text-sm font-medium'>S.NO</th>
                                        <th className='p-3 text-sm font-medium'>Student</th>
                                        <th className='p-3 text-sm font-medium'>Course</th>
                                        <th className='p-3 text-sm font-medium'>Rating</th>
                                        <th className='p-3 text-sm font-medium'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className='text-gray-700 text-sm'>
                                    {reviews.length === 0 ? (
                                        <tr><td colSpan={5} className="p-4 text-center text-gray-400">No reviews found</td></tr>
                                    ) : (
                                        reviews.map((review, index) => (
                                            <tr key={index} className='border-b border-gray-100 hover:bg-gray-50'>
                                                <td className='p-3 text-center'>{index + 1}</td>
                                                <td className='p-3 flex items-center gap-3'>
                                                    <img
                                                        src={review.user.imageUrl || "https://via.placeholder.com/30"}
                                                        alt="Profile"
                                                        className='w-8 h-8 rounded-full object-cover'
                                                    />
                                                    <span className='font-medium'>{review.user.name}</span>
                                                </td>
                                                <td className='p-3'>{review.courseTitle}</td>
                                                <td className='p-3 flex items-center'>
                                                    {/* Display Rating Stars */}
                                                    <div className="flex text-yellow-500 text-lg">
                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                            <span key={i} className={i < review.rating ? "text-yellow-500" : "text-gray-300"}>★</span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className='p-3'>
                                                    <div className='flex gap-2'>
                                                        <button
                                                            onClick={() => openEditModal(review)}
                                                            className='text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded transition'
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(review.courseId, review.user._id)}
                                                            className='text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1 rounded transition'
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Edit Modal */}
                {showEditModal && selectedReview && (
                    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                        <div className='bg-white p-6 rounded-lg w-full max-w-sm'>
                            <h2 className='text-lg font-bold mb-4'>Edit Rating</h2>
                            <div className="flex flex-col items-center gap-4 mb-6">
                                <p className="text-gray-600">Select new rating for {selectedReview.courseTitle}</p>
                                <Rating initialRating={newRating} onRate={setNewRating} />
                            </div>
                            <div className='flex justify-end gap-2'>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className='px-4 py-2 border border-gray-300 rounded hover:bg-gray-50'
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    className='px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700'
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default AdminReviews
