import { Outlet } from 'react-router-dom'
import Navbar from '../../component/educator/Navbar'
import Sidebar from '../../component/educator/Sidebar'
import Footer from '../../component/educator/Footer'
import { useAppContext } from '../../context/AppContext'
import { useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'


const Educator = () => {

  const { backendUrl, isLoggedIn, userData, getUserData } = useAppContext()

  useEffect(() => {
    if (userData && isLoggedIn && userData.role !== 'educator') {
      const updateRole = async () => {
        try {
          const { data } = await axios.get(backendUrl + '/api/educator/update-role')
          if (data.success) {
            toast.success(data.message)
            await getUserData()
          } else {
            toast.error(data.message)
          }
        } catch (error: any) {
          toast.error(error.message)
        }
      }
      updateRole()
    }
  }, [userData, isLoggedIn])

  return (
    <div className='min-h-screen text-default bg-white'>
      <Navbar />
      <div className='flex'>
        <Sidebar />
        <div className='flex-1'>
          {<Outlet />}
        </div>

      </div>
      <Footer />
    </div>
  )
}

export default Educator