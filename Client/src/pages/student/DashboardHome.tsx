import { useAppContext } from '../../context/AppContext'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BookOpen, CheckCircle, Clock, Trophy } from 'lucide-react';

const DashboardHome = () => {
    const { enrolledCourses, userData } = useAppContext()


    // Mock Data for Charts
    const learningActivityData = [
        { name: 'Mon', hours: 2 },
        { name: 'Tue', hours: 3.5 },
        { name: 'Wed', hours: 1.5 },
        { name: 'Thu', hours: 4 },
        { name: 'Fri', hours: 3 },
        { name: 'Sat', hours: 5 },
        { name: 'Sun', hours: 2 },
    ];

    const totalHours = enrolledCourses ? enrolledCourses.length * 5 : 0; // Approximate
    const completedCourses = 0; // Default to 0 until we have real progress tracking

    return (
        <div className='space-y-8 animate-fade-in'>
            {/* Header */}
            <div>
                <h1 className='text-3xl font-bold text-gray-900'>Welcome back, {userData?.name || 'Student'}! 👋</h1>
                <p className='text-gray-500 mt-2'>Here's an overview of your learning progress this week.</p>
            </div>

            {/* Stats Overview */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition hover:shadow-md'>
                    <div className='flex items-center justify-between mb-4'>
                        <div className='w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600'>
                            <BookOpen size={24} />
                        </div>
                        <span className='text-xs font-semibold text-green-500 bg-green-50 px-2 py-1 rounded-full'>+12%</span>
                    </div>
                    <p className='text-gray-500 text-sm font-medium'>Enrolled Courses</p>
                    <h3 className='text-3xl font-bold text-gray-900 mt-1'>{enrolledCourses.length}</h3>
                </div>

                <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition hover:shadow-md'>
                    <div className='flex items-center justify-between mb-4'>
                        <div className='w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600'>
                            <CheckCircle size={24} />
                        </div>
                        <span className='text-xs font-semibold text-green-500 bg-green-50 px-2 py-1 rounded-full'>Good Job!</span>
                    </div>
                    <p className='text-gray-500 text-sm font-medium'>Completed Courses</p>
                    <h3 className='text-3xl font-bold text-gray-900 mt-1'>{completedCourses}</h3>
                </div>

                <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition hover:shadow-md'>
                    <div className='flex items-center justify-between mb-4'>
                        <div className='w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600'>
                            <Clock size={24} />
                        </div>
                        <span className='text-xs font-semibold text-purple-500 bg-purple-50 px-2 py-1 rounded-full'>Weekly</span>
                    </div>
                    <p className='text-gray-500 text-sm font-medium'>Hours Spent</p>
                    <h3 className='text-3xl font-bold text-gray-900 mt-1'>{totalHours}h</h3>
                </div>

                <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition hover:shadow-md'>
                    <div className='flex items-center justify-between mb-4'>
                        <div className='w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600'>
                            <Trophy size={24} />
                        </div>
                        <span className='text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded-full'>Rank</span>
                    </div>
                    <p className='text-gray-500 text-sm font-medium'>Achievement Points</p>
                    <h3 className='text-3xl font-bold text-gray-900 mt-1'>1,250</h3>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Learning Activity Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Learning Activity</h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={learningActivityData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="hours"
                                    stroke="#2563EB"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#2563EB', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Continued Learning or Recommendations */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Recommended for You</h2>
                    <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                        {/* Mock Recommendations based on generic titles */}
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex gap-4 p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition">
                                <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                                    <img src={`https://dummyimage.com/100x100/e0e7ff/4f46e5&text=Course`} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">Advanced React Design Patterns</h4>
                                    <p className="text-xs text-gray-500 mt-1">By Sarah Smith</p>
                                    <div className="flex items-center gap-1 mt-2">
                                        <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                                        <span className="text-xs text-gray-500 font-medium">4.8 (120)</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 py-2.5 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition">
                        Browse All Courses
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DashboardHome
