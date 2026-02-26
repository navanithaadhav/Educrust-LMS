import React, { useState } from 'react';
import {
    MessageCircle,
    X,
    Send,
    Bot,
    User,
    Phone,
    Mail,
    BookOpen,
    CheckCircle
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';

// Mock Supabase client for now since we don't have the configuration
const supabase = {
    from: (table: string) => ({
        insert: async (data: any) => {
            console.log('Simulating Supabase insert:', table, data);
            return { error: null };
        }
    })
};

interface Message {
    id: string;
    type: 'bot' | 'user';
    content: string;
    timestamp: Date;
}

interface InquiryForm {
    name: string;
    email: string;
    phone: string;
    course_interest: string;
    message: string;
}

const CourseChatbot: React.FC = () => {
    const { enrolledCourses } = useAppContext();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    // Check if we are on a course details page and if the user is enrolled
    const isEnrolledInCurrentCourse = React.useMemo(() => {
        if (location.pathname.startsWith('/course/')) {
            const courseId = location.pathname.split('/')[2];
            return enrolledCourses.some(course => course._id === courseId);
        }
        return false;
    }, [location.pathname, enrolledCourses]);

    if (isEnrolledInCurrentCourse) {
        return null;
    }
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            type: 'bot',
            content: 'Hello! 👋 I\'m here to help you with course inquiries. What would you like to know about our courses?',
            timestamp: new Date()
        }
    ]);
    const [showForm, setShowForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<InquiryForm>({
        name: '',
        email: '',
        phone: '',
        course_interest: '',
        message: ''
    });

    const predefinedResponses = {
        'courses': 'We offer various courses including:\n• Web Development (Frontend & Backend)\n• Data Science & Machine Learning\n• UI/UX Design\n• Digital Marketing\n• Mobile App Development\n• Cloud Computing\n\nWould you like more details about any specific course?',
        'web development': 'Our Web Development course covers:\n• HTML, CSS, JavaScript\n• React.js & Node.js\n• Database Management\n• API Development\n• Deployment & DevOps\n\nDuration: 6 months\nMode: Online & Offline\nCertification: Industry recognized\n\nWould you like to get more information or speak with our counselor?',
        'data science': 'Our Data Science course includes:\n• Python Programming\n• Statistics & Mathematics\n• Machine Learning\n• Data Visualization\n• Big Data Analytics\n\nDuration: 8 months\nMode: Online & Offline\nPlacement Support: 100%\n\nInterested in enrolling or need more details?',
        'ui/ux': 'Our UI/UX Design course covers:\n• Design Principles\n• Figma & Adobe XD\n• User Research\n• Prototyping\n• Portfolio Development\n\nDuration: 4 months\nMode: Online\nIncludes: Live Projects\n\nWant to know about admission process?',
        'fees': 'Our course fees vary based on the program:\n• Web Development: ₹45,000\n• Data Science: ₹65,000\n• UI/UX Design: ₹35,000\n• Digital Marketing: ₹25,000\n\nWe offer:\n• EMI options available\n• Early bird discounts\n• Scholarship programs\n\nWould you like to discuss payment options?',
        'placement': 'We have excellent placement support:\n• 95% placement rate\n• Average salary: ₹8.5 LPA\n• 500+ hiring partners\n• Dedicated placement team\n• Interview preparation\n• Resume building support\n\nWant to connect with our placement team?',
        'contact': 'You can reach us at:\n📞 +91 8778543730\n✉️ info@educrest.com\n\nWould you like to schedule a counseling session?'
    };

    const addMessage = (content: string, type: 'bot' | 'user') => {
        const newMessage: Message = {
            id: Date.now().toString(),
            type,
            content,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);
    };

    const handleUserMessage = (userInput: string) => {
        addMessage(userInput, 'user');

        const input = userInput.toLowerCase();
        let botResponse = '';

        // Find matching response
        for (const [key, response] of Object.entries(predefinedResponses)) {
            if (input.includes(key)) {
                botResponse = response;
                break;
            }
        }

        if (!botResponse) {
            botResponse = 'Thank you for your inquiry! I\'d be happy to help you with more specific information. You can ask me about:\n\n• Available Courses\n• Fees & Payment Options\n• Placement Support\n• Contact Information\n\nOr would you like to fill out an inquiry form to get personalized assistance from our counselors?';
        }

        setTimeout(() => {
            addMessage(botResponse, 'bot');

            // Suggest form if user seems interested
            if (input.includes('enroll') || input.includes('admission') || input.includes('counselor') || input.includes('more information')) {
                setTimeout(() => {
                    addMessage('Would you like to fill out a quick inquiry form? Our counselors will get back to you within 24 hours with detailed information! 📝', 'bot');
                }, 1000);
            }
        }, 1000);
    };

    const handleQuickReply = (message: string) => {
        handleUserMessage(message);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const { error } = await supabase
                .from('course_inquiries')
                .insert([{
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    course_interest: formData.course_interest,
                    message: formData.message
                }]);

            if (error) throw error;

            toast.success("Inquiry Submitted Successfully! Our counselors will contact you within 24 hours.");

            addMessage(`Thank you ${formData.name}! Your inquiry has been submitted successfully. Our counselors will contact you at ${formData.email} within 24 hours. 🎉`, 'bot');

            setShowForm(false);
            setFormData({
                name: '',
                email: '',
                phone: '',
                course_interest: '',
                message: ''
            });

        } catch (error) {
            console.error('Error submitting inquiry:', error);
            toast.error("Failed to submit inquiry. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const quickReplies = [
        'Available Courses',
        'Web Development',
        'Data Science',
        'Fees & Payment',
        'Placement Support',
        'Contact Information'
    ];

    if (!isOpen) {
        return (
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setIsOpen(true)}
                    className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-white"
                >
                    <MessageCircle className="h-6 w-6" />
                </button>
            </div>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <div className="w-80 sm:w-96 h-[500px] sm:h-[600px] shadow-2xl bg-white rounded-lg flex flex-col overflow-hidden border border-gray-200">

                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <Bot className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">EduCrest Assistant</h3>
                            <p className="text-xs text-blue-100">Ask me about our courses!</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-white hover:bg-black/20 p-1 rounded transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex-1 flex flex-col overflow-hidden relative bg-gray-50">
                    {!showForm ? (
                        <>
                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`flex items-start space-x-2 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${message.type === 'bot'
                                                ? 'bg-blue-100 text-blue-600'
                                                : 'bg-indigo-100 text-indigo-600'
                                                }`}>
                                                {message.type === 'bot' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                                            </div>
                                            <div className={`rounded-lg p-3 shadow-sm ${message.type === 'bot'
                                                ? 'bg-white text-gray-800 border border-gray-100'
                                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                                                }`}>
                                                <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Quick Replies */}
                            <div className="p-4 bg-white border-t border-gray-100">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {quickReplies.map((reply, index) => (
                                        <span
                                            key={index}
                                            className="cursor-pointer text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border border-transparent transition-all duration-200"
                                            onClick={() => handleQuickReply(reply)}
                                        >
                                            {reply}
                                        </span>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setShowForm(true)}
                                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-2 px-4 rounded-lg flex items-center justify-center transition-all shadow-md font-medium text-sm"
                                >
                                    <Send className="h-4 w-4 mr-2" />
                                    Get Personalized Assistance
                                </button>
                            </div>
                        </>
                    ) : (
                        /* Inquiry Form */
                        <div className="flex-1 overflow-y-auto p-4 bg-white">
                            <div className="mb-4 text-center">
                                <h3 className="text-lg font-bold text-gray-800">Course Inquiry</h3>
                                <p className="text-xs text-gray-500">Fill out this form and we'll contact you shortly.</p>
                            </div>

                            <form onSubmit={handleFormSubmit} className="space-y-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        <User className="h-3 w-3 inline mr-1" />
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="Enter your full name"
                                        className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        <Mail className="h-3 w-3 inline mr-1" />
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                        placeholder="Enter your email"
                                        className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        <Phone className="h-3 w-3 inline mr-1" />
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                        placeholder="Enter your phone number"
                                        className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        <BookOpen className="h-3 w-3 inline mr-1" />
                                        Course Interest
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.course_interest}
                                        onChange={(e) => setFormData(prev => ({ ...prev, course_interest: e.target.value }))}
                                        placeholder="e.g., Web Development"
                                        className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Message *
                                    </label>
                                    <textarea
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                                        placeholder="Tell us about your learning goals..."
                                        rows={3}
                                        className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                                    />
                                </div>

                                <div className="flex space-x-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="flex-1 py-2 px-3 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 py-2 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-sm font-medium transition-all shadow flex items-center justify-center"
                                    >
                                        {isSubmitting ? (
                                            'Sending...'
                                        ) : (
                                            <>
                                                <CheckCircle className="h-4 w-4 mr-1.5" />
                                                Submit
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseChatbot;
