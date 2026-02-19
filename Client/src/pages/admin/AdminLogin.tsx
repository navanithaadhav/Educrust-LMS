import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const AdminLogin = () => {
    const navigate = useNavigate()
    const { backendUrl, setIsLoggedIn, getUserData } = useAppContext()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const onSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.post(backendUrl + '/api/auth/login', {
                email,
                password
            })
            if (data.success) {
                if (data.user && data.user.role === 'admin') {
                    setIsLoggedIn(true);
                    getUserData();
                    navigate('/admin/dashboard');
                    toast.success("Welcome Admin!");
                } else {
                    toast.error("Access Denied: Not an Admin");
                    // Optionally logout if they logged in as student but tried to access admin
                }
            } else {
                toast.error(data.message)
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    return (
        <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
            <img onClick={() => navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />
            <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
                <h2 className='text-3xl font-semibold text-white text-center mb-3'>Admin Login</h2>
                <p className='text-center text-sm mb-6'>Login to your admin dashboard!</p>
                <form onSubmit={onSubmitHandler}>
                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                        <img src={assets.mail_icon} alt="" />
                        <input onChange={e => setEmail(e.target.value)} value={email} className='bg-transparent outline-none' type="email" placeholder='Email id' required />
                    </div>

                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                        <img src={assets.lock_icon} alt="" />
                        <input onChange={e => setPassword(e.target.value)} value={password} className='bg-transparent outline-none' type="password" placeholder='Password' required />
                    </div>

                    <button className='w-full py-2.5 rounded-full text-white font-medium bg-gradient-to-r from-indigo-500 to-indigo-900'>Login</button>
                </form>
            </div>
        </div>
    )
}

export default AdminLogin
