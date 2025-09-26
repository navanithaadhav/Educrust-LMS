
import { Routes,Route, useMatch } from 'react-router-dom'
import Home from './pages/student/Home'
import Login from './pages/Login'
import Emailverify from './pages/Emailverify'
import ResetPassword from './pages/Resetpassword' // fixed casing
import { ToastContainer } from 'react-toastify';
import CourseList from './pages/student/CourseList'
import CourseDetails from './pages/student/CourseDetails'
import Players from './pages/student/Players'
import Loading from './component/student/Loading'
import Educator from './pages/educator/Educator'
import Dashboard from './pages/educator/Dashboard'
import AddCourse from './pages/educator/AddCourse'
import MyCourses from './pages/educator/MyCourses'
import StudentEnrollment from './pages/educator/StudentEnrollment'
import MyEnrollments from './pages/student/MyEnrollments'
import Navbar from './component/student/Navbar'
import "quill/dist/quill.snow.css";
import QuizApp from './pages/student/QuizApp'




const App = () => {

const isEducatorRoute=useMatch('/educator/*')

  return (
    <div >
      <ToastContainer />
      {!isEducatorRoute && <Navbar />}

      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/emailverify" element={<Emailverify/>} />
        <Route path="/resetpassword" element={<ResetPassword/>} />
        <Route path='/course-list' element={<CourseList />} />
        <Route path='/course-list/:input' element={<CourseList />} />
        <Route path='/course/:id' element={<CourseDetails />} />
        <Route path='/course/quiz' element={<QuizApp />} />
        
        <Route path='/my-enrollments' element={<MyEnrollments/>} />
        <Route path='/player/:courseId' element={<Players />} />
        <Route path='/loading/:path' element={<Loading />} />
        <Route path='/educator' element={<Educator />} >
           <Route path='/educator' element={< Dashboard/>}/>
           <Route path='add-course' element={< AddCourse/>}/>
           <Route path='my-course' element={< MyCourses/>}/>
           <Route path='student-enrolled' element={< StudentEnrollment/>}/>
           

        </Route>
     </Routes>
   
    </div>
  )
}

export default App
