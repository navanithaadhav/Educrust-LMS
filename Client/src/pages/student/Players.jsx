import React, { useContext, useState } from 'react'
import { useEffect } from 'react'
import { AppContext } from '../../context/AppContext'
import { useParams } from 'react-router-dom'
import { assets } from '../../assets/assets'
import humanizeDuration from 'humanize-duration'
import YouTube from 'react-youtube'
import Footeronly from '../../component/student/Footeronly'
import Rating from '../../component/student/Rating'

const Players = () => {
  const [courseData, setCourseData] = useState(null)
  const [openSections, setOpenSections] = useState({})
  const [playerData, setPlayerData] = useState(null)
  const { courseId } = useParams()
  const { enrolledCourses, calculateChapterTime } = useContext(AppContext)

  const getCourseData = () => {
    enrolledCourses.map((course) => {
      if (course._id === courseId) {
        setCourseData(course)
      }
    })
  }

  useEffect(() => {
    getCourseData()
  }, [enrolledCourses, courseId])

  const toggleSection = (index) => {
    setOpenSections(prev => ({ ...prev, [index]: !prev[index] }))
  }

  return (
    <>
    <div className='p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-15'>
     { /*left column*/}
    <div className='text-gray-800'>
      <h2 className='text-xl font-semibold '>Course Structure</h2>
      <div className='pt-5'>
        {courseData && courseData.courseContent.map((chapter, index) => (
          <div key={index} className='border border-gray-300 bg-white mb-2 rounded'>
            <div onClick={() => toggleSection(index)} className='flex items-center justify-between px-4 py-3 cursor-pointer select-none hover:bg-gray-100'>
              <div className='flex items-center space-x-2'>
                <img className={`transition transition-transform ${openSections[index] ? 'rotate-180' : ''}`}
                  src={assets.down_arrow_icon} alt="arrow_icon" />
                <p className='font-medium md:text-base text-sm'>{chapter.chapterTitle}</p>
              </div>
              <p className='text-sm md:text-default'>{chapter.chapterContent.length} lectures-{calculateChapterTime(chapter)}</p>
            </div>
            <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? 'max-h-96' : 'max-h-0'}`}>
              <ul className='list-disc md:pl-8 pl-4 py-2 text-gray-600 border-t border-gray-300'>
                {chapter.chapterContent.map((lecture, i) => (
                  <li key={i} className='flex item-start gap-2 py-1'>
                    <img src={false ? assets.blue_tick_icon : assets.play_icon} alt="play icon" className='w-4 h-4 mt-1' />
                    <div className='flex items-center justify-between w-full text-gray-800 text-xs md:text-default'>
                      <p>{lecture.lectureTitle}</p>
                      <div className='flex gap-4 px-2'>
                        {lecture.lectureUrl && <p
                          onClick={() => setPlayerData({
                           ...lecture, chapter: index + 1, lecture: i + 1
                          })}
                          className='text-blue-500 cursor-pointer'>Watch</p>
                        }
                        <p>{humanizeDuration((lecture.lectureDuration || 0) * 60 * 1000, { units: ['h', 'm'] })}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}

      </div>
    <div className='flex items-center mt-10 gap-2 py-3'>
      <h1 className='text-xl font-bold'>Rate This Course</h1>
      <Rating />
    </div>

    </div>
    


   { /*right column*/}
    <div>
      { playerData ?(
        <div className='md:mt-10'>
          <YouTube videoId={playerData.lectureUrl.split('/').pop()} iframeClassName='w-full aspect-video'/>
          <div className='flex justify-between items-center mt-1 '>
            <p>{playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}</p>
            <button className='text-blue-600'>{false ? 'Completed' : 'Mark complete'}</button>
          </div>
        </div>
      ) : <img src={courseData ? courseData.courseThumbnail : ''}  alt="" />
      }
    </div> 
   </div>
   <Footeronly/>
    </>

  )
}


export default Players
