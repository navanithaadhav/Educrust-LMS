import React from 'react';
import { Course } from '../../types';
import { assets } from '../../assets/assets';
import { Check, X, Clock, CreditCard, Sparkles, ShieldCheck } from 'lucide-react';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    course: Course;
    currency: string;
    onSelectPlan: (plan: 'full' | 'split') => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, course, currency, onSelectPlan }) => {
    if (!isOpen) return null;

    const basePrice = course.coursePrice - (course.discount * course.coursePrice) / 100;
    const fullPaymentPrice = basePrice * 0.98;
    const splitPaymentPrice = basePrice * 0.40;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-6 md:p-8 text-center border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white">
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100">
                        <img src={assets.cross_icon} alt="Close" className="w-4 h-4" />
                    </button>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Choose Your Payment Plan</h2>
                    <p className="text-gray-500 mt-2">Select the best option that works for you</p>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">

                        {/* Split Payment Card */}
                        <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 relative bg-white">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                    <Clock size={20} />
                                </div>
                                <h3 className="font-bold text-xl text-gray-800">Split Payment</h3>
                            </div>

                            <div className="mb-6">
                                <p className="text-sm text-gray-500 mb-1">Pay initial 40% now</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-lg font-bold text-gray-500">{currency}</span>
                                    <span className="text-4xl font-extrabold text-gray-900">{splitPaymentPrice.toFixed(0)}</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">Then 30% + 30% later</p>
                            </div>

                            <button
                                onClick={() => onSelectPlan('split')}
                                className="w-full py-3 px-4 bg-white border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors mb-6"
                            >
                                Choose Split Plan
                            </button>

                            <div className="space-y-3">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">What's included</p>
                                <ul className="space-y-3 text-sm text-gray-600">
                                    <li className="flex items-start gap-3">
                                        <Check className="text-green-500 shrink-0" size={18} />
                                        <span>Instant access to course content</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="text-green-500 shrink-0" size={18} />
                                        <span>Pay easier with installments</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="text-green-500 shrink-0" size={18} />
                                        <span>No interest charged</span>
                                    </li>
                                    <li className="flex items-start gap-3 opacity-50">
                                        <X className="text-gray-400 shrink-0" size={18} />
                                        <span>Extra 2% discount</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Full Payment Card */}
                        <div className="border-2 border-blue-600 rounded-xl p-6 shadow-xl relative bg-blue-50/30 transform md:-translate-y-2">
                            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-lg uppercase tracking-wide flex items-center gap-1">
                                <Sparkles size={12} fill="currentColor" />
                                Most Popular
                            </div>

                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-blue-600 rounded-lg text-white shadow-md">
                                    <CreditCard size={20} />
                                </div>
                                <h3 className="font-bold text-xl text-gray-900">Full Payment</h3>
                            </div>

                            <div className="mb-6">
                                <p className="text-sm text-blue-600 font-medium mb-1">Save extra 2% instantly</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-lg font-bold text-gray-500">{currency}</span>
                                    <span className="text-4xl font-extrabold text-gray-900">{fullPaymentPrice.toFixed(0)}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-sm text-gray-400 line-through">{currency}{basePrice.toFixed(0)}</span>
                                    <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">SAVE 2%</span>
                                </div>
                            </div>

                            <button
                                onClick={() => onSelectPlan('full')}
                                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 mb-6"
                            >
                                Pay Full & Save
                            </button>

                            <div className="space-y-3">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Everything in Split, plus</p>
                                <ul className="space-y-3 text-sm text-gray-600">
                                    <li className="flex items-start gap-3">
                                        <Check className="text-blue-600 shrink-0" size={18} />
                                        <span className="font-medium text-gray-900">Instant 2% extra discount</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="text-blue-600 shrink-0" size={18} />
                                        <span>One-time secure payment</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="text-blue-600 shrink-0" size={18} />
                                        <span>Hassle-free experience</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <ShieldCheck className="text-blue-600 shrink-0" size={18} />
                                        <span>30-day money-back guarantee</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                            <ShieldCheck size={14} />
                            Payments are secure and encrypted
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
