import { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import AdminSidebar from '../../component/admin/AdminSidebar'
import { Check, X, Award } from 'lucide-react'

const AdminCertificates = () => {
    const { backendUrl } = useAppContext()
    const [requests, setRequests] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchRequests()
    }, [])

    const fetchRequests = async () => {
        setLoading(true)
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/certificate-requests')
            if (data.success) {
                setRequests(data.requests)
            } else {
                toast.error(data.message)
            }
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateStatus = async (progressId: string, status: string) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/update-certificate-status', {
                progressId,
                status
            })
            if (data.success) {
                toast.success(data.message)
                fetchRequests()
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
                    <div className='flex items-center gap-3'>
                        <div className='p-2 bg-yellow-100 rounded-lg text-yellow-600'>
                            <Award size={24} />
                        </div>
                        <h1 className='text-3xl font-bold text-gray-800'>Certificate Requests</h1>
                    </div>
                    <button
                        onClick={fetchRequests}
                        className='bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded hover:bg-gray-50 transition text-sm font-medium'
                    >
                        Refresh Requests
                    </button>
                </div>

                <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
                    {loading ? (
                        <div className='flex flex-col items-center justify-center py-20 gap-4 uppercase tracking-widest text-gray-400'>
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            <span>Loading Requests...</span>
                        </div>
                    ) : requests.length === 0 ? (
                        <div className='flex flex-col items-center justify-center py-20 text-gray-500'>
                            <Award size={48} className='text-gray-200 mb-4' />
                            <p className='text-xl font-medium'>No pending certificate requests</p>
                            <p className='text-sm mt-1'>Requests from students will appear here for approval.</p>
                        </div>
                    ) : (
                        <div className='overflow-x-auto'>
                            <table className='w-full text-left border-collapse'>
                                <thead>
                                    <tr className='border-b border-gray-200'>
                                        <th className='p-3 text-sm font-medium text-gray-500'>Student</th>
                                        <th className='p-3 text-sm font-medium text-gray-500'>Course</th>
                                        <th className='p-3 text-sm font-medium text-gray-500'>Requested At</th>
                                        <th className='p-3 text-sm font-medium text-gray-500 text-right'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.map((request: any) => (
                                        <tr key={request._id} className='border-b border-gray-100 hover:bg-gray-50 transition-colors'>
                                            <td className='p-3'>
                                                <div className='flex items-center gap-3'>
                                                    <img
                                                        src={request.userImage || "https://i.ibb.co/6r4Jj70/user.png"}
                                                        alt={request.userName}
                                                        className='w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm'
                                                    />
                                                    <div>
                                                        <p className='font-semibold text-gray-900'>{request.userName}</p>
                                                        <p className='text-xs text-gray-500'>{request.userEmail}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='p-3'>
                                                <div className='flex flex-col'>
                                                    <span className='font-medium text-gray-800'>{request.courseTitle}</span>
                                                    <span className='text-[10px] text-gray-400 flex items-center gap-1 uppercase tracking-tight'>
                                                        Course ID: {request.courseId}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className='p-3 text-sm text-gray-600 font-medium'>
                                                {new Date(request.requestedAt).toLocaleDateString(undefined, {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </td>
                                            <td className='p-3'>
                                                <div className='flex items-center justify-end gap-2'>
                                                    <button
                                                        onClick={() => handleUpdateStatus(request._id, 'approved')}
                                                        className='flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-md text-xs font-bold transition-all shadow-sm active:scale-95'
                                                        title='Approve'
                                                    >
                                                        <Check size={14} />
                                                        APPROVE
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(request._id, 'none')}
                                                        className='flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-md text-xs font-bold transition-all active:scale-95'
                                                        title='Reject / Reset'
                                                    >
                                                        <X size={14} />
                                                        REJECT
                                                    </button>
                                                </div>
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

export default AdminCertificates
