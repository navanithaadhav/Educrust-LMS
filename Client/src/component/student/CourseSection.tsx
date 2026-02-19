import { Link } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import Card from './Card'



const CourseSection = () => {

  const { allCourses } = useAppContext()

  return (
    <div className='py-16 md:px-8 lg:px-14 px-8 flex flex-col justify-center items-center'>
      <h2 className='text-3xl text-center font-medium text-gray-800'>Learn From The Best</h2>
      <p className='text-sm text-center md:text-base text-gray-500 mt-3'>Discover our top-rated courses across various categories.From coding and design to<br /> business and
        wellness,our courses are crafted to deliver results
      </p>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 px-4 md:px-0 md:my-10 my-10 gap-8 '>
        {allCourses.slice(0, 4).map((course, index) => <Card key={index} course={course} />)}
      </div>
      <Link to={'/course-list'} onClick={() => { scrollTo(0, 0) }} className='text-gray-800  border border-gray-500/30  px-10 py-3 rounded'>Show all courses</Link>
    </div>
  )
}

export default CourseSection