import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

import { Check, X, Clock, CreditCard, Sparkles, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Course } from '../../types';
import Loading from '../../component/student/Loading';
import Footeronly from '../../component/student/Footeronly';

const PaymentPlans = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { backendUrl, currency, enrolCourse, enrolledCourses } = useAppContext();
    const [courseData, setCourseData] = useState<Course | null>(null);

    const fetchCourseData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/course/' + id);
            if (data.success) {
                setCourseData(data.course);
            } else {
                toast.error(data.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (id) {
            fetchCourseData();
        }
    }, [id]);

    useEffect(() => {
        if (enrolledCourses.length > 0 && id) {
            const isEnrolled = enrolledCourses.some(course => course._id === id);
            if (isEnrolled) {
                toast.info("You are already enrolled in this course");
                navigate('/my-enrollments');
            }
        }
    }, [enrolledCourses, id, navigate]);

    if (!courseData) return <Loading />;

    const basePrice = courseData.coursePrice - (courseData.discount * courseData.coursePrice) / 100;
    const fullPaymentPrice = basePrice * 0.98;
    const splitPaymentPrice = basePrice * 0.40;

    const handleSelectPlan = async (plan: 'full' | 'split') => {
        if (courseData) {
            await enrolCourse(courseData._id, plan);
        }
    }

    return (
        <>
            <div className='flex md:flex-row flex-col-reverse gap-30 relative items-start justify-between md:px-8 lg:px-14 px-8 md:pt-10 pt-10 text-left min-h-screen'>
                <div className='absolute top-0 left-0 w-full h-section-height -z-1 bg-gradient-to-b from-cyan-100/70'></div>

                <div className="w-full max-w-6xl mx-auto py-10">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Choose Your Payment Plan</h1>
                        <p className="text-lg text-gray-600">Unlock <span className="font-semibold text-blue-600">{courseData.courseTitle}</span> today</p>
                    </div>

                    {/* Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start max-w-4xl mx-auto">

                        {/* Split Payment Card */}
                        <div className="border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-shadow duration-300 relative bg-white">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                                    <Clock size={24} />
                                </div>
                                <h3 className="font-bold text-2xl text-gray-800">Split Payment</h3>
                            </div>

                            <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <p className="text-sm font-medium text-gray-500 mb-1">Pay initial 40% now</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-bold text-gray-500">{currency}</span>
                                    <span className="text-5xl font-extrabold text-gray-900">{splitPaymentPrice.toFixed(0)}</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-2 font-medium">Then 30% + 30% later</p>
                            </div>

                            <button
                                onClick={() => handleSelectPlan('split')}
                                className="w-full py-4 px-6 bg-white border-2 border-blue-600 text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors mb-8"
                            >
                                Choose Split Plan
                            </button>

                            <div className="space-y-4">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">What's included</p>
                                <ul className="space-y-3 text-base text-gray-600">
                                    <li className="flex items-start gap-3">
                                        <Check className="text-green-500 shrink-0 mt-0.5" size={20} />
                                        <span>Instant access to course content</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="text-green-500 shrink-0 mt-0.5" size={20} />
                                        <span>Pay easier with installments</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="text-green-500 shrink-0 mt-0.5" size={20} />
                                        <span>No interest charged</span>
                                    </li>
                                    <li className="flex items-start gap-3 opacity-40">
                                        <X className="text-gray-400 shrink-0 mt-0.5" size={20} />
                                        <span>Extra 2% discount</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Full Payment Card */}
                        <div className="border-2 border-blue-600 rounded-2xl p-8 shadow-2xl relative bg-white transform md:-translate-y-4 z-10">
                            <div className="absolute top-0 right-0 left-0 -mt-5 flex justify-center">
                                <span className="bg-blue-600 text-white text-sm font-bold px-6 py-2 rounded-full uppercase tracking-wide flex items-center gap-2 shadow-lg">
                                    <Sparkles size={16} fill="currentColor" />
                                    Most Popular
                                </span>
                            </div>

                            <div className="flex items-center gap-3 mb-6 mt-4">
                                <div className="p-3 bg-blue-600 rounded-xl text-white shadow-lg">
                                    <CreditCard size={24} />
                                </div>
                                <h3 className="font-bold text-2xl text-gray-900">Full Payment</h3>
                            </div>

                            <div className="mb-8 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                                <p className="text-sm font-bold text-blue-600 mb-1">Save extra 2% instantly</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-bold text-gray-500">{currency}</span>
                                    <span className="text-5xl font-extrabold text-gray-900">{fullPaymentPrice.toFixed(0)}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-base text-gray-400 line-through">{currency} {basePrice.toFixed(0)}</span>
                                    <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200">SAVE 2%</span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleSelectPlan('full')}
                                className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 mb-8"
                            >
                                Pay Full & Save
                            </button>

                            <div className="space-y-4">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Everything in Split, plus</p>
                                <ul className="space-y-3 text-base text-gray-600">
                                    <li className="flex items-start gap-3">
                                        <Check className="text-blue-600 shrink-0 mt-0.5" size={20} />
                                        <span className="font-medium text-gray-900">Instant 2% extra discount</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="text-blue-600 shrink-0 mt-0.5" size={20} />
                                        <span>One-time secure payment</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="text-blue-600 shrink-0 mt-0.5" size={20} />
                                        <span>Hassle-free experience</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <ShieldCheck className="text-blue-600 shrink-0 mt-0.5" size={20} />
                                        <span>30-day money-back guarantee</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>

                    <div className="mt-12 text-center pb-10">
                        <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
                            <ShieldCheck size={16} />
                            SSL Encrypted Payment
                            <span className="mx-2">•</span>
                            24/7 Support
                            <span className="mx-2">•</span>
                            Cancel Anytime
                        </p>
                    </div>
                </div>
            </div>
            <Footeronly />
        </>
    );
};

export default PaymentPlans;
