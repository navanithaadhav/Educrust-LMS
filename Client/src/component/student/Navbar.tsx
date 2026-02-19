import { Link as ScrollLink } from 'react-scroll'

import { assets } from '../../assets/assets'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Menu, X, ChevronDown, LogOut, LayoutDashboard } from 'lucide-react'
import OfferBar from './OfferBar'

const Navbar = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);


    // De-structure from context
    const context = useAppContext();
    const isUserLoggedIn = context.isLoggedIn;
    const user = context.userData;

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const logout = async () => {
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.post(context.backendUrl + '/api/auth/logout');
            if (data.success) {
                context.setIsLoggedIn(false);
                context.setUserData(null);
                navigate('/');
                toast.success("Logged Out");
            } else {
                toast.error(data.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    const navLinks = [
        { name: 'About', path: '/about' },
        { name: 'Courses', path: '/course-list' },
    ];

    const isHomePage = location.pathname === '/';

    return (
        <>
            <div className={`sticky top-0 left-0 w-full z-50 flex flex-col`}>
                {isHomePage && <OfferBar />}
                <nav className={`w-full transition-all duration-300 bg-blue-900 py-3 `}>
                    <div className="mx-auto px-4 sm:px-8 md:px-8 lg:px-14 flex justify-between items-center">

                        {/* Logo */}
                        <Link to='/' className="flex items-center gap-2 cursor-pointer">
                            <img src={assets.logo} alt="logo" className="w-8 sm:w-10" />
                            <h1 className={`text-xl sm:text-2xl font-bold tracking-tight text-white`}>EduCrest</h1>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex gap-8 items-center">
                            {navLinks.map((link) => (
                                <Link key={link.name} to={link.path} className={`text-sm font-medium transition-colors hover:text-blue-600 text-white`}>
                                    {link.name}
                                </Link>
                            ))}
                            {isHomePage && (
                                <ScrollLink to='contact' smooth duration={500} offset={-70} className={`cursor-pointer text-sm font-medium transition-colors hover:text-blue-600 text-white`}>
                                    Contact
                                </ScrollLink>
                            )}

                            {isUserLoggedIn && user ? (
                                <>
                                    {user.role === 'educator' ? (
                                        <Link to='/educator' className={`text-sm font-medium transition-colors hover:text-blue-600 text-white`}>Educator Dashboard</Link>
                                    ) : user.role === 'admin' ? (
                                        <Link to='/admin/dashboard' className={`text-sm font-medium transition-colors hover:text-blue-600 text-white`}>Admin Dashboard</Link>
                                    ) : (
                                        <Link to='/student/dashboard' className={`text-sm font-medium transition-colors hover:text-blue-600 text-white`}>Dashboard</Link>
                                    )}
                                </>
                            ) : null}
                        </div>

                        {/* Auth / Profile */}
                        <div className="hidden md:flex items-center gap-4">
                            {isUserLoggedIn ? (
                                <div className='flex items-center gap-3 group relative cursor-pointer'>
                                    <div className={`flex items-center gap-2 text-sm font-medium hover:text-blue-600 text-white`}>
                                        {user?.imageUrl ? (
                                            <img src={user.imageUrl} className='w-8 h-8 rounded-full object-cover border border-gray-200' alt="pfp" />
                                        ) : (
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${scrolled ? 'bg-blue-100 text-blue-600' : 'bg-white/20 text-white'}`}>{user?.name?.charAt(0)}</div>
                                        )}
                                        <span>{user?.name?.split(' ')[0]}</span>
                                        <ChevronDown size={16} />
                                    </div>

                                    {/* Dropdown */}
                                    <div className='absolute top-full right-0 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50'>
                                        <div className='bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden w-48'>
                                            <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                                                <p className="text-xs text-gray-500 font-medium">Signed in as</p>
                                                <p className="text-sm font-semibold text-gray-900 truncate">{user?.email}</p>
                                            </div>
                                            <div className="py-1">
                                                <button
                                                    onClick={() => navigate(user?.role === 'educator' ? '/educator' : user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard')}
                                                    className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2'
                                                >
                                                    <LayoutDashboard size={16} /> Dashboard
                                                </button>
                                                <button onClick={logout} className='w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2'>
                                                    <LogOut size={16} /> Logout
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => navigate('/login', { state: { state: 'Login' } })}
                                        className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-200'}`}
                                    >
                                        Log in
                                    </button>
                                    <button
                                        onClick={() => navigate('/login', { state: { state: 'Sign Up' } })}
                                        className={`px-5 py-2 rounded-full text-sm font-medium text-white shadow-lg transition-all hover:scale-105 ${scrolled ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20' : 'bg-white/20 border border-white/40 hover:bg-white hover:text-blue-900'}`}
                                    >
                                        Sign Up
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className='md:hidden flex items-center'>
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`transition-colors p-2 ${scrolled ? 'text-gray-700' : 'text-white'}`}>
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Overlay */}
                    <div className={`md:hidden fixed inset-0 z-40 transition-all duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
                        {/* Backdrop */}
                        <div
                            className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                            onClick={() => setIsMenuOpen(false)}
                        ></div>

                        {/* Menu Content - Slide from Right */}
                        <div className={`absolute top-0 right-0 h-full w-full sm:w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                            <div className="p-4 flex flex-col gap-4 h-full overflow-y-auto">
                                <div className="flex justify-end mb-5">
                                    <button onClick={() => setIsMenuOpen(false)} className="p-2 text-gray-500 hover:text-gray-700">
                                        <X size={24} />
                                    </button>
                                </div>

                                {navLinks.map((link) => (
                                    <Link key={link.name} onClick={() => setIsMenuOpen(false)} to={link.path} className="px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors">
                                        {link.name}
                                    </Link>
                                ))}
                                {isHomePage && (
                                    <ScrollLink onClick={() => setIsMenuOpen(false)} to='contact' smooth duration={500} offset={-70} className="px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors cursor-pointer">
                                        Contact
                                    </ScrollLink>
                                )}

                                <div className="h-px bg-gray-100 my-2"></div>

                                {isUserLoggedIn && user ? (
                                    <>
                                        <Link onClick={() => setIsMenuOpen(false)} to={user.role === 'educator' ? '/educator' : user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} className="px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors flex items-center gap-2">
                                            <LayoutDashboard size={18} /> Dashboard
                                        </Link>
                                        <button onClick={() => { logout(); setIsMenuOpen(false); }} className="w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 font-medium transition-colors flex items-center gap-2">
                                            <LogOut size={18} /> Logout
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex flex-col gap-3 mt-2">
                                        <button
                                            onClick={() => { navigate('/login', { state: { state: 'Login' } }); setIsMenuOpen(false); }}
                                            className="w-full py-3 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                                        >
                                            Log in
                                        </button>
                                        <button
                                            onClick={() => { navigate('/login', { state: { state: 'Sign Up' } }); setIsMenuOpen(false); }}
                                            className="w-full py-3 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-colors"
                                        >
                                            Sign Up
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
            {/* Spacer for sticky navbar prevention of content overlap if needed, but sticky is fixed so we might need padding on body or next section. 
                However, for "transparent at top" effect, we don't want a spacer. 
            */}
        </>
    )
}

export default Navbar