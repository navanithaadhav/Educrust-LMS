import { useState, useEffect } from 'react'
import { useAppContext } from '../../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { Line } from 'rc-progress'
import { PlayCircle, Award } from 'lucide-react'

const MyEnrollments = () => {
  const navigate = useNavigate()
  const { enrolledCourses, calculateCourseDuration, calculateNoOfLecture, getCourseProgress } = useAppContext()
  const [progressMap, setProgressMap] = useState<{ [key: string]: { completedLectures: number, totalLectures: number } }>({})

  useEffect(() => {
    const fetchProgress = async () => {
      const newProgressMap: any = {}
      await Promise.all(enrolledCourses.map(async (course) => {
        if (course) {
          const data = await getCourseProgress(course._id)
          newProgressMap[course._id] = {
            completedLectures: data?.completedLectures?.length || 0,
            totalLectures: calculateNoOfLecture(course)
          }
        }
      }))
      setProgressMap(newProgressMap)
    }

    if (enrolledCourses.length > 0) {
      fetchProgress()
    }
  }, [enrolledCourses])

  return (
    <div className='animate-fade-in space-y-8'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold text-gray-900'>My Courses</h1>
        <span className='bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium'>
          {enrolledCourses.length} Enrolled
        </span>
      </div>

      {enrolledCourses.length === 0 ? (
        <div className='text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300'>
          <div className='w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400'>
            <PlayCircle size={32} />
          </div>
          <h3 className='text-lg font-medium text-gray-900'>No courses yet</h3>
          <p className='text-gray-500 mt-1 mb-6'>Start learning by enrolling in a course today.</p>
          <button onClick={() => navigate('/course-list')} className='px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition'>
            Browse Courses
          </button>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {enrolledCourses.filter(course => course).map((course, index) => {
            const progress = progressMap[course._id] || { completedLectures: 0, totalLectures: 1 };
            const percent = (progress.completedLectures / progress.totalLectures) * 100;
            const isCompleted = percent === 100 && progress.totalLectures > 0;

            return (
              <div key={index} className='bg-white group rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col'>
                {/* Thumbnail */}
                <div className='relative h-44 overflow-hidden'>
                  <img src={course.courseThumbnail} alt='' className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500' />
                  <div className='absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors' />

                  {isCompleted && (
                    <div className='absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm'>
                      <Award size={12} /> Completed
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className='p-5 flex flex-col flex-1'>
                  <h3 className='font-bold text-gray-900 text-lg line-clamp-2 mb-2 min-h-[56px]'>{course.courseTitle}</h3>

                  <div className='flex items-center text-xs text-gray-500 gap-3 mb-4'>
                    <span>{calculateCourseDuration(course)}</span>
                    <span className='w-1 h-1 bg-gray-300 rounded-full'></span>
                    <span>{progress.completedLectures} / {progress.totalLectures} Lectures</span>
                  </div>

                  {/* Progress Bar */}
                  <div className='mt-auto space-y-3 font-medium'>
                    <div className='flex items-center justify-between text-xs mb-1'>
                      <span className='text-gray-600'>{Math.round(percent > 100 ? 100 : percent)}% Complete</span>
                    </div>
                    <Line percent={percent > 100 ? 100 : percent} strokeWidth={3} strokeColor={isCompleted ? "#22c55e" : "#2563eb"} trailColor="#e5e7eb" className='rounded-full' />

                    <button
                      onClick={() => navigate('/player/' + course._id)}
                      className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${isCompleted
                        ? 'bg-green-50 text-green-700 hover:bg-green-100'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-900/10 shadow-lg'
                        }`}
                    >
                      {isCompleted ? (
                        <> <Award size={16} /> View Certificate </>
                      ) : (
                        <> <PlayCircle size={16} /> Continue Learning </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MyEnrollments