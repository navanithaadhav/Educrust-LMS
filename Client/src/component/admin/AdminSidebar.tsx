
import { assets } from '../../assets/assets'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const AdminSidebar = () => {
    const navigate = useNavigate()
    const location = useLocation()
    // Assuming logout logic might be needed here or kept in dashboard main area?
    // In Dashboard it was: <button onClick={logout} ...>Logout</button>
    // Let's include logout in sidebar as it was in Dashboard.
    // We need logout function from AppContext? No, Dashboard implemented it directly but used setIsLoggedIn from context.
    // Let's check how logout was implemented in AdminDashboard.
    // It cleared token and navigated.
    // Better to pass or handle logout here.

    // Checking AdminDashboard again... it imports { useAppContext }
    // const { setIsLoggedIn } = useAppContext()
    // const logout = () => { ... }

    // Let's replicate logout here.
    const { setIsLoggedIn } = useAppContext() // list? no, specific props.
    // Let's just import basics. context usually provides setLoggedin.

    const logout = () => {
        localStorage.removeItem('token')
        setIsLoggedIn(false)
        navigate('/login', { state: { state: 'Login' } })
    }

    const isActive = (path: string) => location.pathname === path

    return (
        <div className='w-64 bg-slate-900 text-white min-h-screen p-5 hidden md:block border-r border-slate-800'>
            <div onClick={() => navigate('/')} className='flex items-center gap-2 mb-10 cursor-pointer'>
                <img src={assets.logo} alt="Logo" className='w-8' />
                <span className='text-2xl font-bold text-blue-400'>EduCrust</span>
            </div>
            <nav className='flex flex-col gap-4'>
                <div onClick={() => navigate('/admin/dashboard')}
                    className={`flex items-center gap-2 p-2 hover:text-white transition cursor-pointer rounded ${isActive('/admin/dashboard') ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}>
                    Dashboard
                </div>
                <div onClick={() => navigate('/admin/users')}
                    className={`flex items-center gap-2 p-2 hover:text-white transition cursor-pointer rounded ${isActive('/admin/users') ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}>
                    Users
                </div>
                <div onClick={() => navigate('/admin/courses')}
                    className={`flex items-center gap-2 p-2 hover:text-white transition cursor-pointer rounded ${isActive('/admin/courses') ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}>
                    Courses
                </div>
                <div onClick={() => navigate('/admin/add-course')}
                    className={`flex items-center gap-2 p-2 hover:text-white transition cursor-pointer rounded ${isActive('/admin/add-course') ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}>
                    Add Course
                </div>
                <div onClick={() => navigate('/admin/enrollments')}
                    className={`flex items-center gap-2 p-2 hover:text-white transition cursor-pointer rounded ${isActive('/admin/enrollments') ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}>
                    Enrollments
                </div>
                <div onClick={() => navigate('/admin/reviews')}
                    className={`flex items-center gap-2 p-2 hover:text-white transition cursor-pointer rounded ${isActive('/admin/reviews') ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}>
                    Reviews
                </div>
                <div onClick={() => navigate('/admin/certificates')}
                    className={`flex items-center gap-2 p-2 hover:text-white transition cursor-pointer rounded ${isActive('/admin/certificates') ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}>
                    Certificates
                </div>
                <button onClick={logout} className='mt-10 flex items-center gap-2 text-red-400 hover:text-red-300 p-2 transition text-left'>
                    Logout
                </button>
            </nav>
        </div>
    )
}

export default AdminSidebar
