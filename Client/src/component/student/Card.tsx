import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import { Course } from '../../types'
import Timer from './Timer'

interface CardProps {
    course: Course;
}

const Card: React.FC<CardProps> = ({ course }) => {
    const { currency, calculateRating } = useAppContext()

    // Deterministic random values for demo
    const getDemoData = () => {
        if (!course._id) return { rating: 5, count: 22, offerExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000) };
        const hash = course._id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const rating = hash % 2 === 0 ? 5 : 4.5;
        const count = (hash % 500) + 400; // Random count between 400 and 900

        // Deterministic offer expiry: Current time + (hash % 24) hours + (hash % 60) minutes
        const now = new Date();
        const futureTime = new Date(now.getTime() + (12 + (hash % 12)) * 60 * 60 * 1000 + (hash % 60) * 60 * 1000);

        return { rating, count, offerExpiry: futureTime };
    }
    const { rating: demoRating, count: demoCount, offerExpiry } = getDemoData();

    return (
        <Link to={'/course/' + course._id} onClick={() => scrollTo(0, 0)}
            className='border border-gray-500/30 pb-6 overflow-hidden rounded-lg bg-white shadow-[0px_4px_15px_0px] shadow-black/5 relative group'>

            <img className="w-full h-40 object-cover" src={course.courseThumbnail} alt="" />

            {/* Offer Badge - Only if discount exists */}
            <div className='absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded shadow-md'>
                Limited Offer
            </div>


            <div className='p-3 text-left'>
                <h3 className='text-base font-semibold truncate'>{course.courseTitle}</h3> {/* Added truncate for long titles */}
                <p className='text-gray-500'>Navanitha</p>
                <div className='flex items-center space-x-2'>
                    <p>{calculateRating(course) || demoRating}</p>
                    <div className='flex'>
                        {[...Array(5)].map((_, i) => (
                            <img key={i} src={i < Math.floor(calculateRating(course) || demoRating) ? assets.star : assets.star_blank} alt='star' className='w-3.5 h-3.5' />
                        ))}
                    </div>
                    <p className='text-gray-500'>{course.courseRatings.length || demoCount}</p>
                </div>

                {/* Price and Timer Section */}
                <div className='flex justify-between items-center mt-2'>
                    <p className='text-base font-semibold text-gray-800'>{currency}{(course.coursePrice - course.discount * course.coursePrice / 100).toFixed(2)}</p>
                    <Timer targetDate={offerExpiry} />
                </div>
            </div>
        </Link>
    )
}

export default Card


