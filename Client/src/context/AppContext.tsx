import axios from "axios";
import { useEffect, useRef, createContext, useState, ReactNode, useContext } from "react";
import { toast } from "react-toastify";
import { dummyTestimonial, assets } from "../assets/assets";
import humanizeDuration from 'humanize-duration';
import { Course, Testimonial, UserData, Chapter } from "../types";
import { io } from 'socket.io-client';


export interface AppContextType {
  currency: string;
  backendUrl: string;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  userData: UserData | null;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
  allCourses: Course[];
  educatorCourses: Course[];
  testimonial: Testimonial[];
  enrolledCourses: Course[];
  isEducator: boolean;
  setIsEducator: React.Dispatch<React.SetStateAction<boolean>>;
  isAuthLoading: boolean;
  calculateRating: (course: Course) => number;
  calculateChapterTime: (chapter: Chapter) => string;
  calculateCourseDuration: (course: Course) => string;
  calculateNoOfLecture: (course: Course) => number;
  fetchAllCourses: () => Promise<void>;
  fetchTestimonials: () => Promise<void>;
  fetchUserEnrolledCourses: () => Promise<void>;
  fetchEducatorCourses: () => Promise<void>;
  deleteCourse: (courseId: string, role: string) => Promise<boolean>;
  updateCourse: (courseId: string, courseData: any, image: File | null, role?: string) => Promise<boolean>;
  getUserData: () => Promise<void>;
  enrolCourse: (courseId: string, plan?: 'full' | 'split') => Promise<void>;
  updateCourseProgress: (courseId: string, lectureId: string) => Promise<any>;
  getCourseProgress: (courseId: string) => Promise<any>;
  requestCertificate: (courseId: string) => Promise<boolean>;
  markCertificateDownloaded: (courseId: string) => Promise<boolean>;
  // Expose socket accessor for components that need real‑time communication
  getSocket: () => ReturnType<typeof io> | null;
}

export const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};

interface AppContextProviderProps {
  children: ReactNode;
}

export function AppContextProvider({ children }: AppContextProviderProps) {
  axios.defaults.withCredentials = true;

  const currency = import.meta.env.VITE_CURRENCY || "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isEducator, setIsEducator] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [educatorCourses, setEducatorCourses] = useState<Course[]>([]);
  const [testimonial, setTestimonial] = useState<Testimonial[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  // ---------- SOCKET HANDLING ----------
  const socketRef = useRef<ReturnType<typeof io> | null>(null); // used via getSocket

  // Accessor for components to get the socket instance
  const getSocket = () => socketRef.current;

  // Initialize socket connection when backendUrl is available
  useEffect(() => {
    if (backendUrl && !socketRef.current) {
      socketRef.current = io(backendUrl);
    }
    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [backendUrl]);

  const fetchTestimonials = async () => {
    setTestimonial(dummyTestimonial as Testimonial[]);
  };

  const fetchAllCourses = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/course');
      if (data.success) {
        setAllCourses(data.courses);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const calculateRating = (course: Course) => {
    if (!course.courseRatings || course.courseRatings.length === 0) return 0;
    let sum = 0;
    course.courseRatings.forEach(rating => {
      sum += rating.rating;
    });
    return (sum / course.courseRatings.length);
  };

  const calculateChapterTime = (chapter: Chapter) => {
    let time = 0;
    chapter.chapterContent?.forEach((lecture) => time += Number(lecture.lectureDuration));
    return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] });
  };

  const calculateCourseDuration = (course: Course) => {
    let time = 0;
    course.courseContent?.forEach((chapter) =>
      chapter.chapterContent?.forEach((lecture) => time += Number(lecture.lectureDuration))
    );
    return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] });
  };

  const calculateNoOfLecture = (course: Course) => {
    let totalLectures = 0;
    course.courseContent?.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        totalLectures += chapter.chapterContent.length;
      }
    });
    return totalLectures;
  };

  async function getAuthState() {
    setIsAuthLoading(true); // Ensure it's loading initially, though default is true
    if (!backendUrl) {
      setIsAuthLoading(false);
      return;
    }
    try {
      const { data } = await axios.get(backendUrl + '/api/auth/is-auth');
      if (data && data.success) {
        setIsLoggedIn(true);
        await getUserData();
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    } catch (error: any) {
      // Don't toast error on simple auth check to avoid spamming if not logged in
      // toast.error(error?.response?.data?.message || error.message || 'Failed to get auth state');
      setIsLoggedIn(false);
      setUserData(null);
    } finally {
      setIsAuthLoading(false);
    }
  }

  const getUserData = async () => {
    if (!backendUrl) return;
    try {
      const { data } = await axios.get(backendUrl + '/api/user/data');
      if (data?.success) setUserData(data.userData);
      else if (data && data.message) toast.error(data.message);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message || 'Failed to fetch user data');
    }
  };

  const fetchUserEnrolledCourses = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/enrolled-courses');
      if (data.success) {
        setEnrolledCourses(data.enrolledCourses.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const fetchEducatorCourses = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/educator/courses');
      if (data.success) {
        setEducatorCourses(data.courses);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      console.error("fetchEducatorCourses error:", error);
      toast.error(error.message);
    }
  };


  const deleteCourse = async (courseId: string, role: string) => {
    try {
      const endpoint = role === 'admin'
        ? `${backendUrl}/api/admin/delete-course/${courseId}`
        : `${backendUrl}/api/educator/delete-course/${courseId}`;

      const { data } = await axios.delete(endpoint);

      if (data.success) {
        toast.success(data.message);
        // Refresh courses
        if (role === 'admin') {
          // Admin refresh logic would go here if specialized, but global fetch works
          fetchAllCourses();
        } else {
          fetchEducatorCourses();
          fetchUserEnrolledCourses(); // Refresh dashboard if needed
        }
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error: any) {
      toast.error(error.message);
      return false;
    }
  };

  const updateCourse = async (courseId: string, courseData: any, image: File | null, role: string = 'educator') => {
    try {
      const formData = new FormData();
      formData.append('courseData', JSON.stringify(courseData));
      if (image) {
        formData.append('image', image);
      }

      const endpoint = role === 'admin'
        ? `${backendUrl}/api/admin/edit-course/${courseId}`
        : `${backendUrl}/api/educator/edit-course/${courseId}`;

      const { data } = await axios.post(endpoint, formData);

      if (data.success) {
        toast.success(data.message);
        fetchEducatorCourses();
        fetchAllCourses();
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error: any) {
      toast.error(error.message);
      return false;
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const enrolCourse = async (courseId: string, plan?: 'full' | 'split') => {
    try {
      if (!userData) {
        toast.warn('Please login to enroll is a course')
        return
      }

      const { data } = await axios.post(backendUrl + '/api/user/purchase', { courseId, plan })

      if (data.success) {
        // Razorpay Logic
        console.log("RAZORPAY KEY:", import.meta.env.VITE_RAZORPAY_KEY_ID);
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: data.order.amount,
          currency: data.order.currency,
          name: "Educrust LMS",
          description: "Course Purchase",
          order_id: data.order.id,
          image: assets.logo_black,
          handler: async function (response: any) {
            try {
              const verifyData = await axios.post(backendUrl + '/api/user/verify-payment', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                courseId: courseId,
                plan: plan
              })
              if (verifyData.data.success) {
                toast.success(verifyData.data.message)
                fetchUserEnrolledCourses()
                fetchEducatorCourses() // Update dashboard too if educator
              } else {
                toast.error(verifyData.data.message)
              }
            } catch (error: any) {
              toast.error(error.message)
            }
          },
          prefill: {
            name: userData.name,
            email: userData.email,
            contact: ""
          },
          theme: {
            color: "#3399cc"
          }
        };

        const res = await loadRazorpayScript();

        if (!res) {
          toast.error("Razorpay SDK failed to load. Are you online?");
          return;
        }

        const rzp1 = new (window as any).Razorpay(options);
        rzp1.open();

      } else {
        toast.error(data.message)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const updateCourseProgress = async (courseId: string, lectureId: string) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/update-course-progress', { courseId, lectureId });
      if (data.success) {
        return data.message;
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  const getCourseProgress = async (courseId: string) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/get-course-progress', { courseId });
      if (data.success) {
        return data.progressData;
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  const requestCertificate = async (courseId: string): Promise<boolean> => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/request-certificate', { courseId });
      if (data.success) {
        toast.success(data.message);
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error: any) {
      toast.error(error.message);
      return false;
    }
  }

  const markCertificateDownloaded = async (courseId: string): Promise<boolean> => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/mark-certificate-downloaded', { courseId });
      if (data.success) {
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error: any) {
      toast.error(error.message);
      return false;
    }
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

  const value: AppContextType = {
    currency,
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    allCourses,
    educatorCourses,
    testimonial,
    enrolledCourses,
    isEducator,
    setIsEducator,
    isAuthLoading,
    calculateRating,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLecture,
    // expose socket accessor
    getSocket,
    fetchAllCourses,
    fetchTestimonials,
    fetchUserEnrolledCourses,
    fetchEducatorCourses,
    deleteCourse,
    updateCourse,
    getUserData,
    enrolCourse,
    updateCourseProgress,
    getCourseProgress,
    requestCertificate,
    markCertificateDownloaded
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}