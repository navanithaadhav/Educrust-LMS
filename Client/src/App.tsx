import { Routes, Route, useMatch } from 'react-router-dom'

import { lazy, Suspense } from 'react'
import { ToastContainer } from 'react-toastify';
import Loading from './component/student/Loading'
import Navbar from './component/student/Navbar'
import CourseChatbot from './component/student/CourseChatbot'
import { FaWhatsapp } from 'react-icons/fa'
import "quill/dist/quill.snow.css";

const Home = lazy(() => import('./pages/student/Home'))
const Login = lazy(() => import('./pages/Login'))
const Emailverify = lazy(() => import('./pages/Emailverify'))
const ResetPassword = lazy(() => import('./pages/Resetpassword'))
const CourseList = lazy(() => import('./pages/student/CourseList'))
const CourseDetails = lazy(() => import('./pages/student/CourseDetails'))
const Players = lazy(() => import('./pages/student/Players'))
const Educator = lazy(() => import('./pages/educator/Educator'))
const Dashboard = lazy(() => import('./pages/educator/Dashboard'))
const AddCourse = lazy(() => import('./pages/educator/AddCourse'))
const MyCourses = lazy(() => import('./pages/educator/MyCourses'))
const StudentEnrollment = lazy(() => import('./pages/educator/StudentEnrollment'))
const MyEnrollments = lazy(() => import('./pages/student/MyEnrollments'))
const QuizApp = lazy(() => import('./pages/student/QuizApp'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'))
const AdminCourses = lazy(() => import('./pages/admin/AdminCourses'))
const AdminAddCourse = lazy(() => import('./pages/admin/AdminAddCourse'))
const AdminEnrollment = lazy(() => import('./pages/admin/AdminEnrollment'))
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews'))
const AdminCertificates = lazy(() => import('./pages/admin/AdminCertificates'))
const StudentDashboard = lazy(() => import('./pages/student/StudentDashboard'))
const DashboardHome = lazy(() => import('./pages/student/DashboardHome'))
const StudentProfile = lazy(() => import('./pages/student/StudentProfile'))
const PaymentPlans = lazy(() => import('./pages/student/PaymentPlans'))
const About = lazy(() => import('./pages/student/About'))




import ProtectedRoute from './component/ProtectedRoute'

const App = () => {

  const isEducatorRoute = useMatch('/educator/*')
  const isStudentRoute = useMatch('/student/*')
  const isAdminRoute = useMatch('/admin/*')

  const isLoginRoute = useMatch('/login')
  const isAdminLoginRoute = useMatch('/admin-login')
  const isPlayerRoute = useMatch('/player/:courseId')

  // Show Chatbot and WhatsApp on all routes except Player page for distraction-free learning
  const showFloatingWidgets = !isPlayerRoute;

  return (
    <div >
      <ToastContainer />
      {!isEducatorRoute && !isStudentRoute && !isLoginRoute && !isAdminRoute && !isAdminLoginRoute && <Navbar />}

      {showFloatingWidgets && (
        <>
          <CourseChatbot />
          <a
            href="https://wa.me/918778543730"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-24 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-300 z-50 flex items-center justify-center"
            title="Chat with us on WhatsApp"
          >
            <FaWhatsapp size={28} />
          </a>
        </>
      )}

      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/emailverify" element={<Emailverify />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path='/course-list' element={<CourseList />} />
          <Route path='/course-list/:input' element={<CourseList />} />
          <Route path='/course/:id' element={<CourseDetails />} />
          <Route path='/course/:id/payment-plan' element={<PaymentPlans />} />
          <Route path='/course/quiz' element={<QuizApp />} />
          <Route path='/admin-login' element={<AdminLogin />} />

          {/* Admin Routes */}
          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route path='/admin/dashboard' element={<AdminDashboard />} />
            <Route path='/admin/users' element={<AdminUsers />} />
            <Route path='/admin/courses' element={<AdminCourses />} />
            <Route path='/admin/add-course' element={<AdminAddCourse />} />
            <Route path='/admin/edit-course/:id' element={<AdminAddCourse />} />
            <Route path='/admin/enrollments' element={<AdminEnrollment />} />
            <Route path='/admin/reviews' element={<AdminReviews />} />
            <Route path='/admin/certificates' element={<AdminCertificates />} />
          </Route>

          <Route path='/my-enrollments' element={<MyEnrollments />} />
          <Route path='/player/:courseId' element={<Players />} />
          <Route path='/loading/:path' element={<Loading />} />

          {/* Educator Routes */}
          <Route element={<ProtectedRoute roles={['educator']} />}>
            <Route path='/educator' element={<Educator />} >
              <Route path='/educator' element={< Dashboard />} />
              <Route path='add-course' element={< AddCourse />} />
              <Route path='my-course' element={< MyCourses />} />
              <Route path='student-enrolled' element={< StudentEnrollment />} />
            </Route>
          </Route>

          {/* Student Dashboard Routes */}
          <Route element={<ProtectedRoute roles={['student']} />}>
            <Route path='/student' element={<StudentDashboard />}>
              <Route path='dashboard' element={<DashboardHome />} />
              <Route path='my-enrollments' element={<MyEnrollments />} />
              <Route path='profile' element={<StudentProfile />} />
            </Route>
          </Route>

        </Routes>
      </Suspense>

    </div>
  )
}

export default App
