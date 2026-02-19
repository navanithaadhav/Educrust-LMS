import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Mail, Lock, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react'

const Resetpassword = () => {
  const navigate = useNavigate()
  const { backendUrl } = useAppContext()

  // Form States
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Validation States
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Ensure refs array is correct length
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);


  // --- Validation Logic ---
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) {
      setEmailError("Please enter a valid email format");
    } else {
      setEmailError("");
    }
  }

  const validatePassword = (password: string) => {
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isValidLength = password.length >= 8;

    if (!isValidLength || !hasNumber || !hasSpecialChar) {
      setPasswordError("Must be 8+ chars, include number & special char.");
    } else {
      setPasswordError("");
    }
  }

  // --- Handlers ---
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

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('').slice(0, 6);
    const newOtp = [...otp];

    pasteArray.forEach((char, index) => {
      if (index < 6 && !isNaN(Number(char))) {
        newOtp[index] = char;
      }
    });
    setOtp(newOtp);
    // Focus last filled input
    const lastIndex = pasteArray.length - 1;
    if (lastIndex >= 0 && lastIndex < 5) {
      inputRefs.current[lastIndex]?.focus();
    }
  }


  // --- API Calls ---

  const onSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (emailError || !email) return;

    setIsLoading(true);
    try {
      axios.defaults.withCredentials = true
      const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', { email })
      if (data.success) {
        toast.success(data.message)
        setIsEmailSent(true)
      } else {
        toast.error(data.message)
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false);
    }
  }

  const onSubmitOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.some(digit => digit === "")) {
      toast.error("Please enter the 6-digit code");
      return;
    }
    // No backend verification here purely for UI flow based on existing code structure
    // but usually we verify OTP before asking for password. 
    // The original code passed OTP + Password together in the final step. 
    // We will keep that flow: Client side transition only.
    setIsOtpSubmitted(true);
  }

  const onSubmitNewPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordError || !newPassword) return;

    setIsLoading(true);
    try {
      axios.defaults.withCredentials = true
      const otpValue = otp.join('');
      const { data } = await axios.post(backendUrl + '/api/auth/reset-password', { email, otp: otpValue, newPassword })
      if (data.success) {
        toast.success(data.message)
        navigate('/login', { state: { state: "Login" } }) // Pass "Login" state to Login component
      } else {
        toast.error(data.message)
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Max Width Container */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">

        {/* Left Side - Design */}
        <div className="hidden md:flex flex-col justify-center items-start p-10 lg:p-14 w-full md:w-1/2 bg-gradient-to-br from-indigo-800 to-purple-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-10 -mt-20 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/20 rounded-full -ml-20 -mb-20 blur-3xl"></div>

          <div className="relative z-10">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">Secure Your Account</h1>
            <p className="text-purple-100 text-lg mb-8 leading-relaxed">
              We take your security seriously. Follow the steps to reset your password and regain access to your learning journey.
            </p>
            <div className="flex items-center gap-3 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
              <div className="p-3 bg-white/20 rounded-full"><KeyRound size={24} /></div>
              <div>
                <h3 className="font-semibold text-lg">Password Tips</h3>
                <p className="text-sm text-purple-100">Use a strong, unique password</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Forms */}
        <div className="w-full md:w-1/2 p-8 sm:p-10 lg:p-14 flex flex-col justify-center relative bg-white">

          {/* Back Button */}
          <button onClick={() => navigate('/login', { state: { state: "Login" } })} className="absolute top-8 left-8 text-gray-400 hover:text-gray-600 flex items-center gap-2 transition-colors">
            <ArrowLeft size={20} /> <span className="text-sm font-medium">Back to Login</span>
          </button>


          {/* STEP 1: Email Input */}
          {!isEmailSent && (
            <div className="w-full max-w-md mx-auto fade-in-up">
              <div className="text-center md:text-left mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
                <p className="text-gray-500">Enter your email to receive a reset code.</p>
              </div>

              <form onSubmit={onSubmitEmail} className="flex flex-col gap-5">
                <div className="relative">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block pl-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <input
                      onChange={(e) => {
                        setEmail(e.target.value);
                        validateEmail(e.target.value);
                      }}
                      value={email}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 transition-all outline-none bg-gray-50 focus:bg-white ${emailError ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200 focus:ring-indigo-500/20 focus:border-indigo-500'}`}
                      type="email"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  {emailError && <p className="text-red-500 text-xs mt-1 ml-1">{emailError}</p>}
                </div>

                <button disabled={isLoading} className='w-full py-3.5 rounded-lg text-white font-semibold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70'>
                  {isLoading ? 'Sending...' : 'Send Reset Code'}
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: OTP Input */}
          {isEmailSent && !isOtpSubmitted && (
            <div className="w-full max-w-md mx-auto fade-in-up">
              <div className="text-center md:text-left mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Check your Email</h2>
                <p className="text-gray-500">We've sent a 6-digit code to <span className="font-semibold text-gray-700">{email}</span></p>
              </div>

              <form onSubmit={onSubmitOTP} className="flex flex-col gap-6">
                <div className="flex justify-between gap-2" onPaste={handlePaste}>
                  {Array(6).fill(0).map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      ref={(e) => { inputRefs.current[index] = e }}
                      onChange={(e) => handleInput(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      value={otp[index]}
                      className="w-12 h-14 text-center text-xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all bg-gray-50 focus:bg-white"
                    />
                  ))}
                </div>

                <button className='w-full py-3.5 rounded-lg text-white font-semibold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all'>
                  Verify Code
                </button>

                <p className="text-center text-sm text-gray-500">
                  Didn't receive code? <button type="button" onClick={onSubmitEmail} className="text-indigo-600 hover:text-indigo-800 font-medium">Resend</button>
                </p>
              </form>
            </div>
          )}

          {/* STEP 3: New Password */}
          {isEmailSent && isOtpSubmitted && (
            <div className="w-full max-w-md mx-auto fade-in-up">
              <div className="text-center md:text-left mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
                <p className="text-gray-500">Create a new, strong password for your account.</p>
              </div>

              <form onSubmit={onSubmitNewPassword} className="flex flex-col gap-5">
                <div className="relative">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block pl-1">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        validatePassword(e.target.value);
                      }}
                      value={newPassword}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 transition-all outline-none bg-gray-50 focus:bg-white ${passwordError ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200 focus:ring-indigo-500/20 focus:border-indigo-500'}`}
                      type="password"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  {passwordError && <p className="text-red-500 text-xs mt-1 ml-1">{passwordError}</p>}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg flex gap-3 items-start">
                  <CheckCircle2 className="text-blue-600 shrink-0 mt-0.5" size={18} />
                  <p className="text-sm text-blue-800">Password reset successful? You will be redirected to the login page automatically.</p>
                </div>

                <button disabled={isLoading} className='w-full py-3.5 rounded-lg text-white font-semibold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70'>
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default Resetpassword