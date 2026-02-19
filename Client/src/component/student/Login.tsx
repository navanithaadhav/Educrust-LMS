import { useState, useRef, useEffect } from 'react'

import { useNavigate, useLocation } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { User, Mail, Lock, ArrowRight, Loader, BadgeCheck } from 'lucide-react'
import { useGoogleLogin } from '@react-oauth/google';
import { assets } from '../../assets/assets';

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { backendUrl, setIsLoggedIn, getUserData } = useAppContext()

  const [state, setState] = useState(location.state?.state || "Sign Up")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")

  // OTP State as Array of 6 strings
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false);

  // Refs for input focus
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) {
      setEmailError("Please enter a valid email format (e.g., user@gmail.com)");
    } else {
      setEmailError("");
    }
  }

  const validatePassword = (password: string) => {
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isValidLength = password.length >= 8;

    if (!isValidLength || !hasNumber || !hasSpecialChar) {
      setPasswordError("Password must be at least 8 characters long and include a number and special character.");
    } else {
      setPasswordError("");
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value;
    if (isNaN(Number(val))) return;

    const newOtp = [...otp];
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);

    if (val && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    // Final validation before submit
    if (emailError || !email || passwordError || !password) {
      if (!email) setEmailError("Email is required");
      if (!password) setPasswordError("Password is required");
      return;
    }

    setIsLoading(true);
    try {
      axios.defaults.withCredentials = true;

      if (state === "Sign Up" && !isOtpSubmitted) {
        const { data } = await axios.post(backendUrl + '/api/auth/register', { name, email, password })
        if (data.success) {
          setIsOtpSubmitted(true)
          toast.success(data.message)
        } else {
          toast.error(data.message)
        }
      } else if (state === "Sign Up" && isOtpSubmitted) {
        const otpValue = otp.join('');
        const { data } = await axios.post(backendUrl + '/api/auth/verify-email', { email, otp: otpValue })
        if (data.success) {
          toast.success(data.message)
          setIsLoggedIn(true)
          getUserData()
          navigate('/')
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/auth/login', { email, password })
        if (data.success) {
          setIsLoggedIn(true);
          getUserData();
          navigate('/')
        } else {
          if (data.message && (data.message.includes("Account not verified") || data.message.includes("new OTP has been sent"))) {
            toast.info("Unverified account. Please check your email for the OTP.");
            setState("Sign Up");
            setIsOtpSubmitted(true);
          } else {
            toast.error(data.message)
          }
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setIsLoading(false);
    }

  }

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        const { access_token } = tokenResponse;
        const { data } = await axios.post(backendUrl + '/api/auth/google', { access_token });

        if (data.success) {
          setIsLoggedIn(true);
          getUserData();
          navigate('/')
          toast.success("Logged in with Google successfully")
        } else {
          toast.error(data.message)
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || error.message)
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      toast.error("Google Login Failed")
    },
  });

  useEffect(() => {
    if (isOtpSubmitted && inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, [isOtpSubmitted])

  return (
    <div className="flex min-h-[calc(100vh-80px)] mt-20 md:mt-0 items-center justify-center bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">

        {/* Left Side - Illustration/Content */}
        <div className="hidden md:flex flex-col justify-center items-start p-10 lg:p-14 w-full md:w-1/2 bg-gradient-to-br from-blue-900 to-indigo-700 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-10 -mt-20 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/20 rounded-full -ml-20 -mb-20 blur-3xl"></div>

          <div className="relative z-10">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {state === "Sign Up" ? "Start Your Learning Journey" : "Welcome Back!"}
            </h1>
            <p className="text-blue-100 text-lg mb-8 leading-relaxed">
              {state === "Sign Up"
                ? "Join thousands of students mastering new skills today. Unlock your potential with our expert-led courses."
                : "Resume your learning progress and achieve your goals. Your next lesson is waiting for you."}
            </p>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                <div className="p-2 bg-white/20 rounded-full"><BadgeCheck size={20} /></div>
                <div>
                  <h3 className="font-semibold text-sm">Expert Instructors</h3>
                  <p className="text-xs text-blue-100">Learn from industry leaders</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                <div className="p-2 bg-white/20 rounded-full"><BadgeCheck size={20} /></div>
                <div>
                  <h3 className="font-semibold text-sm">Certificate of Completion</h3>
                  <p className="text-xs text-blue-100">Earn recognized credentials</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-10 lg:p-14 flex flex-col justify-center relative bg-white">
          <div className="w-full max-w-md mx-auto">

            <div className="mb-8 text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {state === "Sign Up" ? (isOtpSubmitted ? "Verify Email" : "Create Account") : "Log In"}
              </h2>
              <p className="text-gray-500 text-sm">
                {state === "Sign Up"
                  ? (isOtpSubmitted ? "Enter the 6-digit code sent to your email" : "Enter your details to get started")
                  : "Please enter your details to continue"}
              </p>
            </div>

            <form onSubmit={onSubmitHandler} className="flex flex-col gap-5">
              {state === "Sign Up" && !isOtpSubmitted && (
                <div className="relative">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block pl-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <input
                      onChange={e => setName(e.target.value)}
                      value={name}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none bg-gray-50 focus:bg-white"
                      type="text"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>
              )}

              {!isOtpSubmitted && (
                <>
                  <div className="relative">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block pl-1">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={18} className="text-gray-400" />
                      </div>
                      <input
                        onChange={e => {
                          setEmail(e.target.value);
                          validateEmail(e.target.value);
                        }}
                        value={email}
                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 transition-all outline-none bg-gray-50 focus:bg-white ${emailError ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200 focus:ring-blue-500/20 focus:border-blue-500'}`}
                        type="email"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                    {emailError && <p className="text-red-500 text-xs mt-1 ml-1">{emailError}</p>}
                  </div>

                  <div className="relative">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block pl-1">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={18} className="text-gray-400" />
                      </div>
                      <input
                        onChange={e => {
                          setPassword(e.target.value);
                          validatePassword(e.target.value);
                        }}
                        value={password}
                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 transition-all outline-none bg-gray-50 focus:bg-white ${passwordError ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200 focus:ring-blue-500/20 focus:border-blue-500'}`}
                        type="password"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    {passwordError && <p className="text-red-500 text-xs mt-1 ml-1">{passwordError}</p>}
                  </div>
                </>
              )}

              {isOtpSubmitted && (
                <div className="flex justify-between gap-2 my-4">
                  {Array(6).fill(0).map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      className="w-12 h-14 text-center text-xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      ref={e => { inputRefs.current[index] = e }}
                      value={otp[index]}
                      onChange={(e) => handleInput(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                    />
                  ))}
                </div>
              )}

              {!isOtpSubmitted && state === "Login" && (
                <div className="flex justify-end">
                  <p onClick={() => navigate('/resetpassword')} className='text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer transition-colors'>
                    Forgot Password?
                  </p>
                </div>
              )}

              <button
                disabled={isLoading}
                className='w-full py-3.5 rounded-lg text-white font-semibold bg-gradient-to-br from-blue-900 to-indigo-700 hover:bg-blue-700 shadow-md transition-all flex items-center justify-center gap-2 group hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed'
              >
                {isLoading ? (
                  <Loader className="animate-spin" size={20} />
                ) : (
                  <>
                    {state === "Sign Up" ? (isOtpSubmitted ? "Verify & Register" : "Create Account") : "Log In"}
                    {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                  </>
                )}
              </button>

              {!isOtpSubmitted && (
                <div className="flex flex-col items-center justify-center mt-2">
                  <p className="text-sm text-gray-500 mb-2">Or continue with</p>
                  <button onClick={() => googleLogin()} className="flex items-center justify-center gap-3 w-full py-3.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all font-medium shadow-sm">
                    <img src={assets.google_icon} alt="Google" className="w-5 h-5" />
                    Continue with Google
                  </button>
                </div>
              )}

            </form>

            <div className="mt-8 text-center pt-6 border-t border-gray-100">
              {!isOtpSubmitted && (
                state === "Sign Up" ? (
                  <p className='text-gray-600 text-sm'>
                    Already have an account?
                    <button onClick={() => setState('Login')} className='ml-2 text-blue-600 font-semibold hover:text-blue-800 transition-colors'>
                      Log In
                    </button>
                  </p>
                ) : (
                  <p className='text-gray-600 text-sm'>
                    Don't have an account?
                    <button onClick={() => setState('Sign Up')} className='ml-2 text-blue-600 font-semibold hover:text-blue-800 transition-colors'>
                      Sign Up
                    </button>
                  </p>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login