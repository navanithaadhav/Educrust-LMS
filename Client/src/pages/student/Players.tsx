import { useState, useEffect } from 'react'
import { useAppContext } from '../../context/AppContext'
import { useParams } from 'react-router-dom'
import humanizeDuration from 'humanize-duration'
import axios from 'axios'
import DOMPurify from 'dompurify'
import Rating from '../../component/student/Rating'
import { Course, Lecture } from '../../types'
import VideoPlayer from '../../component/student/player/VideoPlayer'
import QuizPlayer from '../../component/student/player/QuizPlayer'
import DocViewer from '../../component/student/player/DocViewer'
import CertificateButton from '../../component/student/player/CertificateButton'

const Players = () => {
  const [courseData, setCourseData] = useState<Course | null>(null)
  const [openSections, setOpenSections] = useState<{ [key: number]: boolean }>({})
  const [playerData, setPlayerData] = useState<Lecture & { chapter: number, lecture: number } | null>(null)
  const { courseId } = useParams()
  const { enrolledCourses, backendUrl, userData, updateCourseProgress, getCourseProgress } = useAppContext()
  const [progressData, setProgressData] = useState<any>(null)
  const [isCourseCompleted, setIsCourseCompleted] = useState(false)


  const getCourseData = async () => {
    const enrolledCourse = enrolledCourses.find(course => course._id === courseId)
    if (enrolledCourse) {
      setCourseData(enrolledCourse)
    } else if (userData?.role === 'admin' || userData?.role === 'educator') {
      try {
        const { data } = await axios.get(backendUrl + '/api/course/' + courseId)
        if (data.success) {
          setCourseData(data.course)
        }
      } catch (error) {
        console.error("Error fetching course data for preview:", error)
      }
    }
  }

  useEffect(() => {
    getCourseData()
  }, [enrolledCourses, courseId, userData])

  // Set initial player data when courseData loads
  useEffect(() => {
    if (courseData && courseData.courseContent.length > 0 && !playerData) {
      const firstChapter = courseData.courseContent[0];
      if (firstChapter.chapterContent.length > 0) {
        setPlayerData({ ...firstChapter.chapterContent[0], chapter: 1, lecture: 1 });
      }
    }
  }, [courseData]);




  const toggleSection = (index: number) => {
    setOpenSections(prev => ({ ...prev, [index]: !prev[index] }))
  }

  // Helper to find next lecture
  const goToNextLecture = () => {
    if (!courseData || !playerData) return;

    const currentChapterIndex = playerData.chapter - 1;
    const currentLectureIndex = playerData.lecture - 1;
    const currentChapter = courseData.courseContent[currentChapterIndex];

    // Try next lecture in same chapter
    if (currentLectureIndex + 1 < currentChapter.chapterContent.length) {
      const nextLecture = currentChapter.chapterContent[currentLectureIndex + 1];
      setPlayerData({ ...nextLecture, chapter: playerData.chapter, lecture: playerData.lecture + 1 });
    }
    // Try first lecture of next chapter
    else if (currentChapterIndex + 1 < courseData.courseContent.length) {
      const nextChapter = courseData.courseContent[currentChapterIndex + 1];
      if (nextChapter.chapterContent.length > 0) {
        setPlayerData({ ...nextChapter.chapterContent[0], chapter: playerData.chapter + 1, lecture: 1 });
        // Open the next section
        setOpenSections(prev => ({ ...prev, [currentChapterIndex + 1]: true }));
      }
    } else {
      // Course completed logic could go here
      alert("You have reached the end of the course!");
    }
  }

  // Helper to find previous lecture
  const goToPreviousLecture = () => {
    if (!courseData || !playerData) return;

    const currentChapterIndex = playerData.chapter - 1;
    const currentLectureIndex = playerData.lecture - 1;

    // Try previous lecture in same chapter
    if (currentLectureIndex > 0) {
      const currentChapter = courseData.courseContent[currentChapterIndex];
      const prevLecture = currentChapter.chapterContent[currentLectureIndex - 1];
      setPlayerData({ ...prevLecture, chapter: playerData.chapter, lecture: playerData.lecture - 1 });
    }
    // Try last lecture of previous chapter
    else if (currentChapterIndex > 0) {
      const prevChapter = courseData.courseContent[currentChapterIndex - 1];
      if (prevChapter.chapterContent.length > 0) {
        const lastLectureIndex = prevChapter.chapterContent.length - 1;
        setPlayerData({ ...prevChapter.chapterContent[lastLectureIndex], chapter: playerData.chapter - 1, lecture: lastLectureIndex + 1 });
        setOpenSections(prev => ({ ...prev, [currentChapterIndex - 1]: true }));
      }
    }
  }







  const fetchProgress = async () => {
    if (courseId && userData) {
      const data = await getCourseProgress(courseId)
      if (data) {
        setProgressData(data)
        if (data.isCompleted) {
          setIsCourseCompleted(true)
        }
      }
    }
  }

  const markLectureAsComplete = async (lectureId: string) => {
    if (courseId && userData && lectureId) {
      const response = await updateCourseProgress(courseId, lectureId);
      if (response) {
        fetchProgress(); // Refresh progress
      }
    }
  }

  useEffect(() => {
    fetchProgress()
  }, [courseId, userData])

  useEffect(() => {
    if (playerData && playerData.lectureId) {
      markLectureAsComplete(playerData.lectureId)
    }
  }, [playerData])



  console.log('Current Player Data:', JSON.stringify(playerData, null, 2));

  // Main Content - Right Column
  return (
    <>


      <div className='flex flex-col md:flex-row h-screen overflow-hidden'>
        {/* Sidebar - Left Column */}
        <div className='w-full md:w-80 bg-white border-r border-gray-200 flex flex-col h-full overflow-hidden'>
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className='text-lg font-bold text-gray-800 truncate'>{courseData?.courseTitle || "Course Title"}</h2>
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-gray-500">
                {isCourseCompleted ? "Completed!" : `${progressData ? Math.round((progressData.completedLectures.length / ((courseData?.courseContent || []).reduce((acc, ch) => acc + ch.chapterContent.length, 0) || 1)) * 100) : 0}% Completed`}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${progressData ? Math.round((progressData.completedLectures.length / ((courseData?.courseContent || []).reduce((acc, ch) => acc + ch.chapterContent.length, 0) || 1)) * 100) : 0}%` }}
              ></div>
            </div>
          </div>

          {/* Sidebar Content (Scrollable) */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {courseData && courseData.courseContent.length === 0 && (
              <div className="p-4 text-center text-gray-500 text-sm">
                <p>No lessons added to this course yet.</p>
              </div>
            )}
            {courseData && courseData.courseContent.map((chapter, index) => (
              <div key={index} className='border-b border-gray-100'>
                <button
                  onClick={() => toggleSection(index)}
                  className='w-full flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 text-left transition-colors'
                >
                  <div className='flex items-center gap-2 overflow-hidden'>
                    {/* Custom Arrow or Icon */}
                    <span className={`text-gray-500 text-xs transition-transform ${openSections[index] ? 'rotate-90' : ''}`}>▶</span>
                    <p className='font-medium text-sm text-gray-700 truncate'>{chapter.chapterTitle}</p>
                  </div>
                </button>

                {/* Lectures List */}
                <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? 'max-h-[1000px]' : 'max-h-0'}`}>
                  <ul className='bg-gray-50 pb-2'>
                    {chapter.chapterContent.map((lecture, i) => {
                      const isActive = playerData?.chapter === index + 1 && playerData?.lecture === i + 1;
                      const isCompleted = progressData?.completedLectures?.includes(lecture.lectureId);

                      return (
                        <li key={i} className={`relative`}>
                          <button
                            onClick={() => setPlayerData({ ...lecture, chapter: index + 1, lecture: i + 1 })}
                            className={`w-full flex items-start gap-3 px-8 py-2 text-left hover:bg-gray-100 transition-colors ${isActive ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-600'}`}
                          >
                            <div className="mt-1">
                              {/* Checkbox for visual completion */}
                              <input
                                type="checkbox"
                                readOnly
                                checked={!!isCompleted}
                                className={`cursor-pointer rounded-sm accent-blue-600 w-4 h-4`}
                              />
                            </div>
                            <div className='flex-1 min-w-0'>
                              <p className={`text-sm ${isActive ? 'font-medium' : ''}`}>{lecture.lectureTitle}</p>
                              <p className='text-xs text-gray-400 mt-0.5'>{humanizeDuration((Number(lecture.lectureDuration) || 0) * 60 * 1000, { units: ['h', 'm'] })}</p>
                            </div>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>



        {/* Main Content - Right Column */}
        <div className='flex-1 flex flex-col h-full overflow-hidden bg-white'>

          {/* Top Header Navigation */}
          <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white shrink-0 z-10">
            <h1 className="text-lg font-bold text-gray-800 truncate hidden md:block">
              {playerData ? `${playerData.lectureTitle}` : "Select a Lesson"}
            </h1>
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              {isCourseCompleted && (
                <CertificateButton
                  courseData={courseData}
                  userData={userData}
                  isCourseCompleted={isCourseCompleted}
                />
              )}
              <button
                onClick={goToPreviousLecture}
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900 font-medium px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50"
                disabled={!playerData || (playerData.chapter === 1 && playerData.lecture === 1)}
              >
                <span className="text-lg">‹</span> Previous
              </button>
              <button
                onClick={goToNextLecture}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-sm flex items-center gap-2"
              >
                Complete and Continue <span className="text-lg">›</span>
              </button>
            </div>
          </div>

          {/* Content Area (Scrollable) */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-6 md:p-10">
            <div className="max-w-4xl mx-auto space-y-8">
              {playerData ? (
                <>
                  {/* Resource Player */}
                  <div className={`w-full rounded-lg overflow-hidden shadow-lg relative ${playerData.resourceType === 'quiz' ? '' : (playerData.resourceType === 'video' || !playerData.resourceType ? 'aspect-video bg-black' : 'h-[85vh] bg-gray-100')}`}>
                    <VideoPlayer playerData={playerData} />
                    <DocViewer playerData={playerData} />
                    <QuizPlayer playerData={playerData} />
                  </div>


                  {/* Title & Actions */}
                  <div className="flex justify-between items-start border-b border-gray-200 pb-4 mt-8">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{playerData.lectureTitle}</h1>
                    </div>
                  </div>

                  {/* Rich Text Content */}
                  {playerData.lectureContent && (
                    <div className="lecture-content prose max-w-none text-gray-800 mt-4">
                      <style>{`
                      .lecture-content iframe, 
                      .lecture-content video {
                        width: 100%;
                        max-width: 100%;
                        aspect-ratio: 16 / 9;
                        border-radius: 8px;
                        margin: 1rem 0;
                      }
                      .lecture-content img {
                        max-width: 100%;
                        height: auto;
                        border-radius: 8px;
                        margin: 1rem 0;
                      }
                    `}</style>
                      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(playerData.lectureContent) }} />
                    </div>
                  )}

                  {/* Rating Section */}
                  <div className="pt-10 border-t border-gray-200 mt-10">
                    <h3 className="text-lg font-semibold mb-4">Rate this Course</h3>
                    <Rating />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-20 text-center text-gray-500">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mb-4 animate-pulse"></div>
                  <p>
                    {courseData && courseData.courseContent.length === 0
                      ? "No lessons added to this course yet."
                      : "Select a lecture from the sidebar to start learning."}
                  </p>
                </div>
              )}


            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default Players
