import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OfferBar = () => {
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState<{ hours: number, minutes: number, seconds: number } | null>(null);

    useEffect(() => {
        // Set a fixed target 24 hours from now (or a specific date) for demo purposes
        // To keep it consistent across renders for the user, we could store it, 
        // but for now, let's just say it ends at midnight or similar.
        // Let's use a deterministic future time based on current date to keep it active.
        const targetDate = new Date();
        targetDate.setHours(24, 0, 0, 0); // Next midnight

        const calculateTimeLeft = () => {
            const difference = +targetDate - +new Date();
            if (difference > 0) {
                return {
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
            } else {
                return null;
            }
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    if (!timeLeft) return null;

    return (
        <div className="w-full bg-white backdrop-blur-sm border-b border-blue-200 text-blue-800 py-3 px-4 flex justify-center items-center gap-4">
            <div className="font-semibold text-sm sm:text-base">
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded mr-2">New</span>
                Flash Sale! Get 50% off on all courses
            </div>
            <div className="flex items-center gap-1 text-sm font-mono font-bold bg-blue-100/80 px-2 py-1 rounded">
                <span className="text-blue-900">{String(timeLeft.hours).padStart(2, '0')}h</span> :
                <span className="text-blue-900">{String(timeLeft.minutes).padStart(2, '0')}m</span> :
                <span className="text-blue-900">{String(timeLeft.seconds).padStart(2, '0')}s</span>
            </div>
            <button
                onClick={() => navigate('/course-list')}
                className="hidden sm:block bg-blue-600 text-white text-xs px-3 py-1.5 rounded hover:bg-blue-700 transition cursor-pointer">
                Grab Offer
            </button>
        </div>
    );
};

export default OfferBar;
