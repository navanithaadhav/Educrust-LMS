import axios from "axios";
import { useEffect, createContext, useState } from "react";
import { toast } from "react-toastify";
import { dummyCourses, dummyTestimonial } from "../assets/assets";
import humanizeDuration from 'humanize-duration';

// Only named exports, no default export
export const AppContext = createContext();

export function AppContextProvider({ children }) {
  axios.defaults.withCredentials = true;
  const currency =import.meta.env.VITE_CURRENCY
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(false);
  const [allCourses,setAllCourses]=useState([])
  const[testimonial,setTestimonial]=useState([])
  const[enrolledCourses,setEnrolledCourses]=useState([])
  //Fetch Testmonials
  const fetchTestimonials=async()=>{
    setTestimonial(dummyTestimonial)
  }
  //Fetch all courses
  const fetchAllCourses=async()=>{
    setAllCourses(dummyCourses)
  }
  // Helper function to calculate average rating
  const calculateRating = (course) => {
    if (!course.courseRatings || course.courseRatings.length === 0) return 0;
    let sum =0;
     course.courseRatings.forEach(rating => {
      sum += rating.rating      
    });
    return (sum / course.courseRatings.length);
}
//function to calculate course chapter time
const calculateChapterTime = (chapter) => {
   let time=0
   chapter.chapterContent.map((lecture)=> time += lecture.lectureDuration)
   return humanizeDuration(time *60 * 1000, { units: ['h', 'm'] });
}

//calculate course duration
const calculateCourseDuration = (course) => {
   let time=0
   course.courseContent.map((chapter)=> chapter.chapterContent.map((lecture)=>time += lecture.lectureDuration))
   return humanizeDuration(time *60 * 1000, { units: ['h', 'm'] });
}

//function to calculate no of lecture in the course
const calculateNoOfLecture = (course) => {
  let totalLetures =0;
  course.courseContent.forEach((chapter) =>{
    if(Array.isArray(chapter.chapterContent)){
      totalLetures += chapter.chapterContent.length;
    }
  })
  return totalLetures;
}

  async function getAuthState() {
    try {
      const { data } = await axios.get(backendUrl + '/api/auth/is-auth');
      if (data.success) {
        setIsLoggedIn(true);
        getUserData();
      } else {
        setIsLoggedIn(false);
        setUserData(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/data');
      data.success ? setUserData(data.userData) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

//Fetch user enrolled courses
const fetchUserEnrolledCourses = async () => {
    setEnrolledCourses(dummyCourses)
}


  useEffect(() => {
    getAuthState();
  }, []);
  useEffect(() => {
    fetchAllCourses();
    fetchUserEnrolledCourses();
  }, []);
   useEffect(() => {
    fetchTestimonials();
  }, []);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
    currency,
    allCourses,
    testimonial,calculateRating,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLecture,
    enrolledCourses,
    fetchAllCourses,
    fetchTestimonials,
    fetchUserEnrolledCourses
  };
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}