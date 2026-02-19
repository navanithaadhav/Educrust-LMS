import { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import Loading from '../../component/student/Loading';
import axios from 'axios';
import { toast } from 'react-toastify';

const Dashboard = () => {

  const { backendUrl } = useAppContext()
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(backendUrl + '/api/educator/dashboard')
      if (data.success) {
        setDashboardData(data.dashboardData)
      } else {
        toast.error(data.message)
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <Loading />
  }

  if (!dashboardData) {
    return <div className='min-h-screen flex items-center justify-center text-gray-500'>No Data Available</div>
  }

  return (
    <div className='min-h-screen flex flex-col items-start justify-between gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-0'>
      <div className='space-y-5'>
        <div className=' flex flex-warb gap-5 items-center'>
          <div className='flex items-center gap-3 shadow-card border border-blue-500 p-4 w-60 rounded-md'>
            <img src={assets.patients_icon} alt="patients_icon" />
            <div>
              <p className='text-2xl font-medium text-gray-600'>{dashboardData.enrolledStudentsData.length}</p>
              <p className='text-base text-gray-500'>Total Enrollments</p>
            </div>
          </div>
          <div className='flex items-center gap-3 shadow-card border border-blue-500 p-4 w-60 rounded-md'>
            <img src={assets.appointments_icon} alt="appointments_icon" />
            <div>
              <p className='text-2xl font-medium text-gray-600'>{dashboardData.totalCourses}</p>
              <p className='text-base text-gray-500'>Total Courses</p>
            </div>
          </div>

        </div>

        <div>
          <h2 className='text-lg font-medium text-gray-700 pb-4'>Latest Enrollments</h2>
          <div className='flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20 shadow-card'>
            <table className='w-full table-fixed md:table-auto overflow-hidden'>
              <thead className='text-gray-900 border-b border-gray-500/30 text-sm text-left'>
                <tr>
                  <th className='px-4 py-3 font-semibold text-center hidden sm:table-cell'>S.NO</th>
                  <th className='px-4 py-3 font-semibold '>Student Name</th>
                  <th className='px-4 py-3 font-semibold '>Course Title</th>
                </tr>
              </thead>
              <tbody className='text-sm text-gray-600'>
                {dashboardData.enrolledStudentsData.map((item: any, index: number) => (
                  <tr key={index} className='border-b border-gray-500/30 hover:bg-gray-100'>
                    <td className='px-4 py-3 text-center hidden sm:table-cell'>{index + 1}</td>
                    <td className='md:px-4 px-2 py-3 flex items-center space-x-3'>
                      <img
                        src={item.student.imageUrl} alt="Profile" className='w-9 h-9 rounded-full' />
                      <span className='truncate'>{item.student.name}</span>
                    </td>
                    <td className='px-4 py-3 truncate'>{item.courseTitle}</td>
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

export default Dashboard