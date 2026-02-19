import { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import AdminSidebar from '../../component/admin/AdminSidebar'

const AdminUsers = () => {
    const { backendUrl } = useAppContext()
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddUser, setShowAddUser] = useState(false)
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student'
    })

    useEffect(() => {
        fetchAllUsers()
    }, [])

    const fetchAllUsers = async () => {
        setLoading(true)
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/users')
            if (data.success) {
                setUsers(data.users)
            } else {
                toast.error(data.message)
            }
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const onChangeHandler = (e: any) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }))
    }

    const onAddUser = async (e: any) => {
        e.preventDefault()
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/add-user', userData)
            if (data.success) {
                toast.success(data.message)
                setShowAddUser(false)
                setUserData({
                    name: '',
                    email: '',
                    password: '',
                    role: 'student'
                })
                fetchAllUsers()
            } else {
                toast.error(data.message)
            }
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    // Role Edit State
    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const [editRole, setEditRole] = useState("student");

    const startEdit = (user: any) => {
        setEditingUserId(user._id);
        setEditRole(user.role);
    }

    const cancelEdit = () => {
        setEditingUserId(null);
        setEditRole("student");
    }

    const handleUpdateRole = async (userId: string) => {
        try {
            const { data } = await axios.put(backendUrl + '/api/admin/update-user-role', {
                userId,
                role: editRole
            });
            if (data.success) {
                toast.success(data.message);
                setEditingUserId(null);
                fetchAllUsers();
            } else {
                toast.error(data.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    return (
        <div className='min-h-screen flex bg-gray-50'>
            <AdminSidebar />

            <div className='flex-1 p-10'>
                <div className='flex justify-between items-center mb-8'>
                    <h1 className='text-3xl font-bold text-gray-800'>All Users</h1>
                    <button
                        onClick={() => setShowAddUser(!showAddUser)}
                        className='bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition'
                    >
                        {showAddUser ? 'Cancel' : 'Add New User'}
                    </button>
                </div>

                {showAddUser && (
                    <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8'>
                        <h2 className='text-xl font-semibold mb-4'>Add New User</h2>
                        <form onSubmit={onAddUser} className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={userData.name}
                                    onChange={onChangeHandler}
                                    className='w-full border border-gray-300 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500'
                                    required
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={userData.email}
                                    onChange={onChangeHandler}
                                    className='w-full border border-gray-300 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500'
                                    required
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={userData.password}
                                    onChange={onChangeHandler}
                                    className='w-full border border-gray-300 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500'
                                    required
                                    placeholder='Set initial password'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Role</label>
                                <select
                                    name="role"
                                    value={userData.role}
                                    onChange={onChangeHandler}
                                    className='w-full border border-gray-300 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500'
                                >
                                    <option value="student">Student</option>
                                    <option value="educator">Educator</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className='md:col-span-2 mt-4'>
                                <button type='submit' className='bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition'>
                                    Create User
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
                    {loading ? <p>Loading...</p> : (
                        <div className='overflow-x-auto'>
                            <table className='w-full text-left border-collapse'>
                                <thead>
                                    <tr className='border-b border-gray-200'>
                                        <th className='p-3 text-sm font-medium text-gray-500'>ID</th>
                                        <th className='p-3 text-sm font-medium text-gray-500'>User</th>
                                        <th className='p-3 text-sm font-medium text-gray-500'>Email</th>
                                        <th className='p-3 text-sm font-medium text-gray-500'>Role</th>
                                        <th className='p-3 text-sm font-medium text-gray-500'>Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user: any) => (
                                        <tr key={user._id} className='border-b border-gray-100 hover:bg-gray-50'>
                                            <td className='p-3 text-gray-500 text-xs'>{user._id.substring(0, 6)}...</td>
                                            <td className='p-3 flex items-center gap-3'>
                                                <img src={user.imageUrl || assets.person_icon} alt="" className='w-8 h-8 rounded-full object-cover' />
                                                <span className='font-medium text-gray-800'>{user.name}</span>
                                            </td>
                                            <td className='p-3 text-gray-600'>{user.email}</td>
                                            <td className='p-3 text-gray-600 capitalize'>
                                                {editingUserId === user._id ? (
                                                    <select
                                                        value={editRole}
                                                        onChange={(e) => setEditRole(e.target.value)}
                                                        className='border border-gray-300 rounded p-1 text-sm'
                                                    >
                                                        <option value="student">Student</option>
                                                        <option value="educator">Educator</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                ) : (
                                                    user.role
                                                )}
                                            </td>
                                            <td className='p-3 text-gray-600'>
                                                {editingUserId === user._id ? (
                                                    <div className='flex gap-2'>
                                                        <button
                                                            onClick={() => handleUpdateRole(user._id)}
                                                            className='text-green-600 hover:text-green-800 text-sm font-semibold'
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={cancelEdit}
                                                            className='text-red-500 hover:text-red-700 text-sm'
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className='flex items-center gap-4'>
                                                        <span className='text-sm'>{new Date(user.createdAt).toLocaleDateString()}</span>
                                                        <button
                                                            onClick={() => startEdit(user)}
                                                            className='text-blue-600 hover:text-blue-800 text-xs underline'
                                                        >
                                                            Change Role
                                                        </button>
                                                    </div>
                                                )}
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

export default AdminUsers
