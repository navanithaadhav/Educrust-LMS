
import { Outlet } from 'react-router-dom'
import StudentSidebar from '../../component/student/StudentSidebar'

const StudentDashboard = () => {
    return (
        <div className='min-h-screen flex bg-gray-50'>
            <StudentSidebar />
            <div className='flex-1 p-10 h-screen overflow-y-scroll'>
                <Outlet />
            </div>
        </div>
    )
}

export default StudentDashboard
