import { useAppContext } from "../../context/AppContext"
import { Mail, User, Shield, MapPin, Award, Edit } from "lucide-react"

// Student Profile Component
const StudentProfile = () => {
    const { userData } = useAppContext()

    return (
        <div className="max-w-5xl mx-auto animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
                        <div className="relative mb-6">
                            {userData?.imageUrl ? (
                                <img src={userData.imageUrl} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-blue-50 shadow-md" />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-5xl text-white font-bold border-4 border-blue-50 shadow-md">
                                    {userData?.name?.charAt(0) || 'U'}
                                </div>
                            )}
                            <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg border border-gray-100 text-gray-600 hover:text-blue-600 transition">
                                <Edit size={16} />
                            </button>
                        </div>

                        <h2 className="text-xl font-bold text-gray-900">{userData?.name || 'Student Name'}</h2>
                        <p className="text-gray-500 text-sm mt-1">{userData?.email || 'student@example.com'}</p>

                        <div className="mt-6 w-full flex gap-3">
                            <button className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition">Edit Profile</button>
                            <button className="flex-1 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition border border-gray-200">Settings</button>
                        </div>
                    </div>

                    <div className="bg-blue-50 rounded-2xl p-6 mt-6 border border-blue-100">
                        <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                            <Shield size={18} />
                            Account Status
                        </h3>
                        <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-blue-100/50">
                            <div className="w-2 h-2 rounded-full bg-green-500 ring-4 ring-green-100"></div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Active Student</p>
                                <p className="text-xs text-gray-500">Verified Account</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details & Stats */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Personal Info */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <User size={20} className="text-blue-600" />
                            Personal Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Full Name</label>
                                <p className="text-gray-900 font-medium flex items-center gap-2">
                                    {userData?.name || 'Not provided'}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</label>
                                <p className="text-gray-900 font-medium flex items-center gap-2">
                                    <Mail size={16} className="text-gray-400" />
                                    {userData?.email || 'Not provided'}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</label>
                                <p className="text-gray-900 font-medium flex items-center gap-2">
                                    <Shield size={16} className="text-gray-400" />
                                    {userData?.role || 'Student'}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Location</label>
                                <p className="text-gray-900 font-medium flex items-center gap-2">
                                    <MapPin size={16} className="text-gray-400" />
                                    India
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Certificates/Achievements */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Award size={20} className="text-yellow-500" />
                            Certificates & Achievements
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Mock Certificates */}
                            <div className="border border-gray-200 rounded-xl p-4 flex gap-4 items-center hover:bg-gray-50 transition cursor-pointer group">
                                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600 group-hover:scale-110 transition-transform">
                                    <Award size={24} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 text-sm">Course Completed</h4>
                                    <p className="text-xs text-gray-500">Full Stack Development</p>
                                </div>
                            </div>

                            <div className="border border-dashed border-gray-300 rounded-xl p-4 flex gap-4 items-center justify-center text-gray-400">
                                <span className="text-sm font-medium">Complete more courses to earn badges</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentProfile
