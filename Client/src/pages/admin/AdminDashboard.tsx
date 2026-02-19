import { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import AdminSidebar from '../../component/admin/AdminSidebar'

const AdminDashboard = () => {
    const { backendUrl } = useAppContext()

    const [stats, setStats] = useState<any>(null)
    const [recentUsers, setRecentUsers] = useState<any[]>([])

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/dashboard-stats')
            if (data.success) {
                setStats({
                    ...data.stats,
                    salesData: data.salesData,
                    mostPopularCourses: data.mostPopularCourses
                })
                setRecentUsers(data.recentUsers)
            } else {
                toast.error(data.message)
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    // Mock data for the chart since we don't have historical data API yet
    const data = [
        { name: 'Jan', Users: 400, Courses: 240 },
        { name: 'Feb', Users: 300, Courses: 139 },
        { name: 'Mar', Users: 200, Courses: 980 },
        { name: 'Apr', Users: 278, Courses: 390 },
        { name: 'May', Users: 189, Courses: 480 },
        { name: 'Jun', Users: 239, Courses: 380 },
    ];

    // ... fetchDashboardData

    // ... mock data

    // Removed logout function as it's now in Sidebar (or duplicated there, but we can remove it from here if not used elsewhere)
    // Actually, the main content doesn't use logout. So we can remove it.

    return (
        <div className='min-h-screen flex bg-gray-50'>
            <AdminSidebar />

            {/* Main Content */}
            <div className='flex-1 p-6 sm:p-10 overflow-y-auto min-h-screen'>
                <div className='flex justify-between items-center mb-8'>
                    <h1 className='text-3xl font-bold text-gray-800'>Overview</h1>
                    <div className='flex items-center gap-3'>
                        <span className='text-gray-600'>Admin</span>
                        <div className='w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold'>A</div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10'>
                    <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
                        <h3 className='text-gray-500 text-sm font-medium'>Total Users</h3>
                        <p className='text-3xl font-bold text-gray-800 mt-2'>{stats ? stats.totalUsers : '...'}</p>
                    </div>
                    <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
                        <h3 className='text-gray-500 text-sm font-medium'>Total Courses</h3>
                        <p className='text-3xl font-bold text-gray-800 mt-2'>{stats ? stats.totalCourses : '...'}</p>
                    </div>
                    <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
                        <h3 className='text-gray-500 text-sm font-medium'>Total Revenue</h3>
                        <p className='text-3xl font-bold text-gray-800 mt-2'>{stats ? stats.totalRevenue : '...'}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                    {/* Income Chart (Sales) */}
                    <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
                        <h2 className='text-lg font-semibold text-gray-800 mb-4'>Income (Weekly)</h2>
                        <div className='h-80'>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={stats?.salesData || data}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} name="Sales (₹)" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* High Purchase Chart */}
                    <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
                        <h2 className='text-lg font-semibold text-gray-800 mb-4'>High Purchase Courses</h2>
                        <div className='h-80'>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats?.mostPopularCourses || []} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="courseTitle" type="category" width={150} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="enrolledCount" fill="#82ca9d" name="Enrollments" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Recent Users Table */}
                <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
                    <h2 className='text-lg font-semibold text-gray-800 mb-4'>Recent Signups</h2>
                    <div className='overflow-x-auto'>
                        <table className='w-full text-left border-collapse'>
                            <thead>
                                <tr className='border-b border-gray-200'>
                                    <th className='p-3 text-sm font-medium text-gray-500'>User</th>
                                    <th className='p-3 text-sm font-medium text-gray-500'>Email</th>
                                    <th className='p-3 text-sm font-medium text-gray-500'>Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentUsers.map((user: any) => (
                                    <tr key={user._id} className='border-b border-gray-100 hover:bg-gray-50'>
                                        <td className='p-3 flex items-center gap-3'>
                                            <img src={user.imageUrl || assets.person_icon} alt="" className='w-8 h-8 rounded-full object-cover' />
                                            <span className='font-medium text-gray-800'>{user.name}</span>
                                        </td>
                                        <td className='p-3 text-gray-600'>{user.email}</td>
                                        <td className='p-3 text-gray-600 capitalize'>{user.role}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default AdminDashboard
