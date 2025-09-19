import React, { useEffect, useRef, useState } from "react";
import Quill from "quill";
import { assets } from "../../assets/assets";
import uniqid from 'uniqid';
// ...existing code...

const AddCourse = () => {
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [showLecturePopup, setShowLecturePopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);

  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    isPreviewFree: false,
    notes: "",
  });

  // Handle chapter actions
  const handleChapter = (action, chapterId) => {
    if (action === 'add') {
      const title = prompt("Enter Chapter Title:");
      if (title) {
        const newChapter = { chapterId: uniqid(), chapterTitle: title, chapterContent: [], collapsed: false, chapterOrder: chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1 };
        setChapters([...chapters, newChapter]);
      }
    } else if (action === 'remove') {
      setChapters(chapters.filter(ch => ch.chapterId !== chapterId));
    } else if (action === 'toggle') {
      setChapters(chapters.map(ch => ch.chapterId === chapterId ? { ...ch, collapsed: !ch.collapsed } : ch));
    }
  }


  //Handle lecturre
  const handleLecture = (action, chapterId, lectureId) => {
    if (action === 'add') {
      openLecturePopup(chapterId);
      setShowLecturePopup(true);
    } else if (action === 'remove') {
      setChapters(chapters.map(ch => ch.chapterId === chapterId ? { ...ch, chapterContent: ch.chapterContent.filter(lec => lec.id !== lectureId) } : ch));
    }
  }

  // initialize quill for course description
  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });
    }
  }, []);

  // Add a chapter


  // Open lecture popup
  const openLecturePopup = (chapterId) => {
    setCurrentChapterId(chapterId);
    setShowLecturePopup(true);
  };

  // Add lecture
  const addLecture = () => {
    setChapters(chapters.map((ch) =>{
      if( ch.chapterId === currentChapterId ) {
      const newLecture ={...lectureDetails,lectureOrder:ch.chapterContent.length >0 ? ch.chapterContent.slice(-1)[0].lectureOrder +1 :1,lectureIdd:uniqid()
    };
     ch.chapterContent.push(newLecture)
    };
    return ch
  })
)
setShowLecturePopup(false);
setLectureDetails({
  lectureTitle: "",
  lectureDuration: "",
  lectureUrl: "",
  isPreviewFree: false,
  notes: "",  
});
  }

  //remove lecture
  const removeLecture = (chapterId, lectureId) => {
    setChapters(chapters.map(ch => ch.chapterId === chapterId ? { ...ch, chapterContent: ch.chapterContent.filter(lec => lec.lectureId !== lectureId) } : ch));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
     
    // Submit courseData to backend or perform further actions
  } 
  // <-- Add missing closing brace for addLecture function here

  return (
    <div className="h-screen overflow-y-scroll p-6 space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 flex flex-col trext-gray-500">
        {/* Course Title */}
        <div>
          <p className="font-medium">Course Title</p>
          <input
            type="text"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            placeholder="Enter Course Title"
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {/* Price and Discount */}
        <div className="flex gap-4">
          <div>
            <p>Price</p>
            <input
              type="number"
              value={coursePrice}
              onChange={(e) => setCoursePrice(e.target.valu)}
              className="border rounded px-3 py-2"
            />
          </div>
          <div>
            <p>Discount %</p>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="border rounded px-3 py-2"
            />
          </div>

        </div>

        {/* Course Image */}
        <div className="flex flex-col items-center md:flex-row gap-2">
          <p>Course Thumbnail</p>
          <label htmlFor="thumbnailImage" className="flex items-center gap-3">
            <img src={assets.file_upload_icon} alt="upload" className=" p-3 bg-blue-500 rounded" />
            <input
              type="file"
              id="thumbnailImage"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
            <img src={image ? URL.createObjectURL(image) : ''} alt="" />
          </label>
        </div>

        {/* Course Description with Quill */}
        <div>
          <p>Course Description</p>
          <div ref={editorRef} className="h-40 border rounded"></div>
        </div>


        {/* Chapters & Lectures */}
        <div>


          {chapters.map((chapter, chapterIndex) => (
            <div key={chapterIndex} className="border border-gray-300 p-3 rounded-lg mb-2">
              <div className="flex justify-between items-center border-b p-4 mb-2">
                <div className="flex items-center">
                  <img onClick={()=> handleChapter('toggle',chapter.chapterId)} src={assets.dropdown_icon} width={14} alt='dropdown_icon' className={`mr-2 cursor-pointer transition-all ${chapter.collapsed && '-rotate-90'}`} />
                  <span className="font-semibold">{chapterIndex + 1} {chapter.chapterTitle}</span>
                </div>
                <span>{chapter.chapterContent.length} Lectures</span>
                <img onClick={()=> handleChapter('remove',chapter.chapterId)} src={assets.cross_icon} alt="" className="cursor-pointer" />
              </div>
              {!chapter.collapsed && (
                <div className="p-4" >
                  {chapter.chapterContent.map((lecture, lectureIndex) => (
                    <div key={lectureIndex} className="flex justify-between items-center mb-2">
                      <span>{lectureIndex + 1} {lecture.lectureTitle} - {lecture.lectureDuration} mins - <a href={lecture.lectureUrl} target="_blank" className="text-blue-500">Link</a> - {lecture.isPreviewFree ? 'Free Preview' : 'paid'}</span>
                      <img src={assets.cross_icon} alt="cross_icon" onClick={()=> handleLecture('remove',chapter.chapterId,lectureIndex)}
                      className="cursor-pointer" />
                    </div>

                  ))}
                  <div onClick={()=> handleLecture('add',chapter.chapterId)} className="inline-flex bg-gray-100 p-2 rounded cursor-pointer mt-2">+ Add Lecture</div>
                </div>
              )}

            </div>
          ))}
          <div className="flex justify-center items-center  bg-blue-100 p-2 rounded-lg cursor-pointer mt-2" onClick={() => handleChapter('add')}>+ Add Chapter</div>
        </div>

        {/* Lecture Popup */}
        {showLecturePopup && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white text-gray-700 rounded p-6 w-96 space-y-3 relative">
              <h2 className="font-semibold">Add Lecture</h2>
              <div className="mb-2">
                <p>Lecture Title</p>
              <input
                type="text"
                placeholder="Lecture Title"
                value={lectureDetails.lectureTitle}
                onChange={(e) => setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })}
                className="mt-1 block w-full border rounded px-2 py-1"
              />

              </div>
             <div className="mb-2">
              <p>Duration (minits)</p>
             <input
                type="text"
                placeholder="Duration (e.g. 10m)"
                value={lectureDetails.lectureDuration}
                onChange={(e) =>
                  setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })
                }
                className="mt-1 block w-full border rounded px-2 py-1"
              />
             </div>
              <div className="mb-2">
              <p>Lecture URL</p>
              <input
                type="text"
                placeholder="Video URL"
                value={lectureDetails.lectureUrl}
                onChange={(e) =>
                  setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value })
                }
                className="mt-1 block w-full border rounded px-2 py-1"
              />
              </div>
              <div className="mb-2">
              <textarea
                placeholder="Lecture Notes"
                value={lectureDetails.notes}
                onChange={(e) => setLectureDetails({ ...lectureDetails, notes: e.target.value })}
                className="mt-1 block w-full border rounded px-2 py-1"
              />
              </div>
              <div className="flex items-center gap-2 my-4">
                <p>Is Priview Free?</p>
                <input
                  type="checkbox"
                  checked={lectureDetails.isPreviewFree}
                  className="mt-1 scale-125"
                  onChange={(e) =>
                    setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })
                  }
                />
               
              </div>
              <button type="submit" onClick={addLecture} className="bg-blue-500 text-white px-4 py-2 rounded">Add</button>
              <img src={assets.cross_icon} alt="cross_icon" onClick={() => setShowLecturePopup(false)} className="absolute top-4 right-4 w-4 cursor-pointer" />
              </div>
              
             
          </div>
        
        )}
   
        <button type="submit"  className=" flex justify-center items-center text-white bg-blue-900 p-2 rounded-lg cursor-pointer mt-2" >Add</button>
      </form>
    </div>
  );
}

export default AddCourse;
