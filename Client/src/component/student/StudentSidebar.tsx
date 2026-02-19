import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, User, LogOut } from 'lucide-react';
import { assets } from '../../assets/assets';


const StudentSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    // Helper to check active state more robustly
    const isActive = (path: string) => {
        if (path === '/student/dashboard') {
            return location.pathname === '/student/dashboard' || location.pathname === '/student';
        }
        return location.pathname.startsWith(path);
    };

    const handleLogout = () => {
        // Clear auth logic here if needed, for now just redirect
        // In a real app we might call an API or clear tokens
        navigate('/');
    }

    return (
        <div className='w-64 bg-slate-900 text-white min-h-screen flex flex-col border-r border-slate-800 transition-all duration-300'>
            {/* Logo Area */}
            <div onClick={() => navigate('/')} className='p-6 flex items-center gap-3 border-b border-slate-800/50 cursor-pointer'>
                <img src={assets.logo} alt="Logo" className='w-8 h-8' />
                <span className='text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent'>
                    EduCrust
                </span>
            </div>

            {/* Navigation Links */}
            <div className='flex-1 py-6 px-4 space-y-2'>
                <div
                    onClick={() => navigate('/student/dashboard')}
                    className={`nav-item flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 group ${isActive('/student/dashboard')
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                >
                    <LayoutDashboard size={20} className={`${isActive('/student/dashboard') ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                    <span className="font-medium">Dashboard</span>
                </div>

                <div
                    onClick={() => navigate('/student/my-enrollments')}
                    className={`nav-item flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 group ${isActive('/student/my-enrollments')
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                >
                    <BookOpen size={20} className={`${isActive('/student/my-enrollments') ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                    <span className="font-medium">My Courses</span>
                </div>

                <div
                    onClick={() => navigate('/student/profile')}
                    className={`nav-item flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 group ${isActive('/student/profile')
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                >
                    <User size={20} className={`${isActive('/student/profile') ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                    <span className="font-medium">Profile</span>
                </div>
            </div>

            {/* Bottom Section */}
            <div className='p-4 border-t border-slate-800/50'>
                <button
                    onClick={handleLogout}
                    className='w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors border border-transparent hover:border-red-500/20'
                >
                    <LogOut size={18} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default StudentSidebar;
