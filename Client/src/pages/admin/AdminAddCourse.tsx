import React, { useEffect, useState, useRef } from "react";
import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
import { Chapter, Lecture } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import AdminSidebar from '../../component/admin/AdminSidebar'

interface UIChapter extends Chapter {
    collapsed: boolean;
}

const AdminAddCourse = () => {
    const { backendUrl, updateCourse, allCourses, fetchAllCourses } = useAppContext()
    const navigate = useNavigate()
    const { id } = useParams()

    // Explicit refs to force keyboard deletion
    const courseQuillRef = useRef<ReactQuill>(null);
    const lectureQuillRef = useRef<ReactQuill>(null);

    const [courseDescription, setCourseDescription] = useState("");

    const [courseTitle, setCourseTitle] = useState("");
    const [coursePrice, setCoursePrice] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [image, setImage] = useState<File | null>(null);
    const [chapters, setChapters] = useState<UIChapter[]>([]);
    const [showLecturePopup, setShowLecturePopup] = useState(false);
    const [currentChapterId, setCurrentChapterId] = useState<string | null>(null);
    const [currentLectureIndex, setCurrentLectureIndex] = useState<number | null>(null);
    const [courseCategory, setCourseCategory] = useState("Others");

    const [educators, setEducators] = useState<any[]>([]);
    const [selectedEducator, setSelectedEducator] = useState<string>("");

    useEffect(() => {
        const fetchEducators = async () => {
            try {
                const { data } = await axios.get(backendUrl + '/api/admin/users');
                if (data.success) {
                    const educatorUsers = data.users.filter((user: any) => user.role === 'educator' || user.role === 'admin');
                    setEducators(educatorUsers);
                }
            } catch (error: any) {
                toast.error("Failed to fetch educators");
            }
        };
        fetchEducators();
    }, []);

    const [lectureDetails, setLectureDetails] = useState<{
        lectureTitle: string;
        lectureDuration: string;
        lectureUrl: string;
        publicId?: string;
        isPreviewFree: boolean;
        lectureContent: string;
        resourceType: 'video' | 'pdf' | 'ppt' | 'html-file' | 'quiz';
        questions?: {
            questionId: string;
            question: string;
            options: string[];
            correctAnswer: string;
        }[];
    }>({
        lectureTitle: "",
        lectureDuration: "",
        lectureUrl: "",
        isPreviewFree: false,
        lectureContent: "",
        resourceType: "video",
        questions: [],
    });

    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleChapter = (action: 'add' | 'remove' | 'toggle', chapterId?: string) => {
        if (action === 'add') {
            const title = prompt("Enter Chapter Title:");
            if (title) {
                const newChapter: UIChapter = {
                    chapterId: uuidv4(),
                    chapterTitle: title,
                    chapterContent: [],
                    collapsed: false,
                    chapterOrder: chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1
                };
                setChapters([...chapters, newChapter]);
            }
        } else if (action === 'remove' && chapterId) {
            setChapters(chapters.filter(ch => ch.chapterId !== chapterId));
        } else if (action === 'toggle' && chapterId) {
            setChapters(chapters.map(ch => ch.chapterId === chapterId ? { ...ch, collapsed: !ch.collapsed } : ch));
        }
    }

    const handleLecture = (action: 'add' | 'remove' | 'edit', chapterId: string, lectureIndex?: number) => {
        if (action === 'add') {
            setCurrentLectureIndex(null);
            setLectureDetails({
                lectureTitle: "",
                lectureDuration: "",
                lectureUrl: "",
                publicId: "",
                isPreviewFree: false,
                lectureContent: "",
                resourceType: "video",
                questions: []
            });
            openLecturePopup(chapterId);
            setShowLecturePopup(true);
        } else if (action === 'remove' && lectureIndex !== undefined) {
            setChapters(chapters.map(ch => ch.chapterId === chapterId ? { ...ch, chapterContent: ch.chapterContent.filter((_, index) => index !== lectureIndex) } : ch));
        } else if (action === 'edit' && lectureIndex !== undefined) {
            const chapter = chapters.find(ch => ch.chapterId === chapterId);
            if (chapter) {
                const lecture = chapter.chapterContent[lectureIndex];
                setLectureDetails({
                    lectureTitle: lecture.lectureTitle,
                    lectureDuration: lecture.lectureDuration.toString(),
                    lectureUrl: lecture.lectureUrl || "",
                    publicId: (lecture as any).publicId || "",
                    isPreviewFree: lecture.isPreviewFree,
                    lectureContent: lecture.lectureContent || "",
                    resourceType: (lecture.resourceType as 'video' | 'pdf' | 'ppt' | 'html-file' | 'quiz') || "video",
                    questions: lecture.questions || []
                });
                setCurrentLectureIndex(lectureIndex);
                setCurrentChapterId(chapterId);
                setShowLecturePopup(true);
            }
        }
    }

    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['clean'],
            ['link', 'image', 'video']
        ]
    };

    const [selectedImageInfo, setSelectedImageInfo] = useState<{ element: HTMLElement | null, top: number, left: number } | null>(null);

    // Capture clicks globally on the window to bypass React synthetics and Quill dom shielding
    useEffect(() => {
        const handleWindowClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Look for clicks directly on an IMG tag inside a quill editor
            if (target && target.tagName === 'IMG' && target.closest('.ql-editor')) {
                const rect = target.getBoundingClientRect();
                setSelectedImageInfo({
                    element: target,
                    top: rect.top,
                    left: rect.left
                });
            } else if (target && !target.closest('.delete-image-btn')) {
                // If they clicked anything other than an image or the delete button, clear tooltips
                if (selectedImageInfo) {
                    setSelectedImageInfo(null);
                }
            }
        };

        // true = capture phase, fires before ANY other element in the DOM
        window.addEventListener('click', handleWindowClick, true);
        return () => window.removeEventListener('click', handleWindowClick, true);
    }, [selectedImageInfo]);

    const deleteSelectedImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (selectedImageInfo?.element) {
            // Test both quill bounds to see where this image lives
            const refs = [courseQuillRef, lectureQuillRef];
            for (const ref of refs) {
                if (ref.current) {
                    const editor = ref.current.getEditor();
                    const blot = Quill.find(selectedImageInfo.element);
                    if (blot) {
                        try {
                            const index = editor.getIndex(blot as any);
                            editor.deleteText(index, 1);
                            break; // Stop once we find and delete it
                        } catch (err) { }
                    }
                }
            }
        }
        setSelectedImageInfo(null);
    };

    useEffect(() => {
        if (id && allCourses.length > 0) {
            const course = allCourses.find(c => c._id === id);
            if (course) {
                setCourseTitle(course.courseTitle);
                setCoursePrice(course.coursePrice);
                setDiscount(course.discount);
                setCourseCategory(course.courseCategory || "Others");
                setChapters(course.courseContent ? course.courseContent.map((ch: any) => ({ ...ch, collapsed: false })) : []);
                if (course.educator) {
                    setSelectedEducator(typeof course.educator === 'object' ? (course.educator as any)._id : course.educator);
                }
                setCourseDescription(course.courseDescription || "");
            }
        }
    }, [id, allCourses]);

    const openLecturePopup = (chapterId: string) => {
        setCurrentChapterId(chapterId);
        setShowLecturePopup(true);
    };

    const addLecture = () => {
        if (!lectureDetails.lectureTitle || !lectureDetails.lectureDuration) {
            toast.error("Please fill all lecture details");
            return;
        }

        if (lectureDetails.resourceType !== 'quiz' && !lectureDetails.lectureUrl) {
            toast.error("Please attach a file or enter a video URL");
            return;
        }

        if (lectureDetails.resourceType === 'quiz' && (!lectureDetails.questions || lectureDetails.questions.length === 0)) {
            toast.error("Please add at least one question for the quiz");
            return;
        }

        if (currentLectureIndex !== null && currentChapterId) {
            setChapters(chapters.map((ch) => {
                if (ch.chapterId === currentChapterId) {
                    const updatedContent = [...ch.chapterContent];
                    updatedContent[currentLectureIndex] = {
                        ...updatedContent[currentLectureIndex],
                        ...lectureDetails,
                        lectureId: updatedContent[currentLectureIndex].lectureId || uuidv4()
                    };
                    return { ...ch, chapterContent: updatedContent };
                }
                return ch;
            }));
        } else {
            setChapters(chapters.map((ch) => {
                if (ch.chapterId === currentChapterId) {
                    const newLecture: Lecture = {
                        ...lectureDetails,
                        lectureOrder: ch.chapterContent.length > 0 ? (ch.chapterContent.slice(-1)[0].lectureOrder || 0) + 1 : 1,
                        lectureId: uuidv4()
                    };
                    ch.chapterContent.push(newLecture)
                };
                return ch
            }));
        }

        setShowLecturePopup(false);
        setLectureDetails({
            lectureTitle: "",
            lectureDuration: "",
            lectureUrl: "",
            isPreviewFree: false,
            lectureContent: "",
            resourceType: "video",
            questions: []
        });
        setCurrentLectureIndex(null);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!image && !id) {
            toast.error('Thumbnail Not Attached')
            return;
        }

        const courseData = {
            courseTitle,
            courseDescription: courseDescription,
            coursePrice,
            discount,
            courseCategory,
            courseContent: chapters,
            educator: selectedEducator
        }

        if (id) {
            // Update logic
            const success = await updateCourse(id, courseData, image, 'admin');
            if (success) {
                toast.success("Course Updated Successfully");
                await fetchAllCourses();
                navigate('/admin/courses');
            }
        } else {
            // Add logic
            const formData = new FormData()
            formData.append('courseData', JSON.stringify(courseData))
            if (image) formData.append('image', image)

            try {
                const { data } = await axios.post(backendUrl + '/api/admin/add-course', formData)
                if (data.success) {
                    toast.success(data.message)
                    setCourseTitle('')
                    setCoursePrice(0)
                    setDiscount(0)
                    setImage(null)
                    setChapters([])
                    setSelectedEducator("")
                    setCourseDescription("")
                    await fetchAllCourses();
                } else {
                    toast.error(data.message)
                }
            } catch (error: any) {
                toast.error(error.message)
            }
        }

    }



    // ... imports 

    return (
        <div className='min-h-screen flex bg-gray-50'>
            <AdminSidebar />

            <div className='flex-1 p-10 h-screen overflow-y-scroll'>
                <h1 className='text-3xl font-bold text-gray-800 mb-8'>{id ? "Edit Course" : "Add New Course"}</h1>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-4 flex flex-col trext-gray-500">
                        {/* Copied from AddCourse.tsx - simplified structure */}

                        <div>
                            <p className="font-medium">Educator</p>
                            <select
                                value={selectedEducator}
                                onChange={(e) => setSelectedEducator(e.target.value)}
                                className="w-full border rounded px-3 py-2"
                            >
                                <option value="">Select Educator</option>
                                {educators.map((educator) => (
                                    <option key={educator._id} value={educator._id}>
                                        {educator.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <p className="font-medium">Course Category</p>
                            <select
                                value={courseCategory}
                                onChange={(e) => setCourseCategory(e.target.value)}
                                className="w-full border rounded px-3 py-2"
                            >
                                <option value="Programming">Programming</option>
                                <option value="React JS">React JS</option>
                                <option value="Web Development">Web Development</option>
                                <option value="Mobile Development">Mobile Development</option>
                                <option value="UI/UX Design">UI/UX Design</option>
                                <option value="Data Science">Data Science</option>
                                <option value="Business">Business</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>
                        <div>
                            <p className="font-medium">Course Title</p>
                            <input type="text" value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} placeholder="Enter Course Title" className="w-full border rounded px-3 py-2" required />
                        </div>
                        <div className="flex gap-4">
                            <div><p>Price</p><input type="number" value={coursePrice} onChange={(e) => setCoursePrice(Number(e.target.value))} className="border rounded px-3 py-2" /></div>
                            <div><p>Discount %</p><input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="border rounded px-3 py-2" /></div>
                        </div>
                        <div className="flex flex-col items-center md:flex-row gap-2">
                            <p>Course Thumbnail</p>
                            <label htmlFor="thumbnailImage" className="flex items-center gap-3">
                                <img src={assets.file_upload_icon} alt="upload" className=" p-3 bg-blue-500 rounded" />
                                <input type="file" id="thumbnailImage" accept="image/*" hidden onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)} />
                                {image && <img src={URL.createObjectURL(image)} alt="" className="max-h-20" />}
                            </label>
                        </div>
                        <div className="flex flex-col gap-1 relative">
                            <p>Course Description</p>
                            <div className="bg-white rounded-md mb-8 relative">
                                <ReactQuill
                                    ref={courseQuillRef}
                                    theme="snow"
                                    value={courseDescription}
                                    onChange={setCourseDescription}
                                    className="h-40"
                                />
                                {selectedImageInfo && document.activeElement !== document.body && (
                                    <div
                                        className="delete-image-btn absolute z-50 bg-red-600 text-white p-2 rounded-md font-semibold cursor-pointer shadow-lg hover:bg-red-700 hover:scale-105 transition-all text-sm flex items-center gap-1"
                                        style={{ position: 'fixed', top: selectedImageInfo.top - 45, left: selectedImageInfo.left }}
                                        onClick={deleteSelectedImage}
                                    >
                                        🗑️ Delete Image
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            {chapters.map((chapter, chapterIndex) => (
                                <div key={chapterIndex} className="border border-gray-300 p-3 rounded-lg mb-2">
                                    <div className="flex justify-between items-center border-b p-4 mb-2">
                                        <div className="flex items-center">
                                            <img onClick={() => handleChapter('toggle', chapter.chapterId)} src={assets.dropdown_icon} width={14} alt='dropdown_icon' className={`mr-2 cursor-pointer transition-all ${chapter.collapsed && '-rotate-90'}`} />
                                            <span className="font-semibold">{chapterIndex + 1} {chapter.chapterTitle}</span>
                                        </div>
                                        <span>{chapter.chapterContent.length} Lectures</span>
                                        <img onClick={() => handleChapter('remove', chapter.chapterId)} src={assets.cross_icon} alt="" className="cursor-pointer" />
                                    </div>
                                    {!chapter.collapsed && (
                                        <div className="p-4" >
                                            {chapter.chapterContent.map((lecture, lectureIndex) => (
                                                <div key={lectureIndex} className="flex justify-between items-center mb-2">
                                                    <span>{lectureIndex + 1} {lecture.lectureTitle} - {lecture.lectureDuration} mins - <a href={lecture.lectureUrl} target="_blank" className="text-blue-500">Link</a> - {lecture.isPreviewFree ? 'Free Preview' : 'paid'}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span onClick={() => handleLecture('edit', chapter.chapterId, lectureIndex)} className="text-blue-500 cursor-pointer hover:underline">Edit</span>
                                                        <img src={assets.cross_icon} alt="cross_icon" onClick={() => handleLecture('remove', chapter.chapterId, lectureIndex)} className="cursor-pointer" />
                                                    </div>
                                                </div>
                                            ))}
                                            <div onClick={() => handleLecture('add', chapter.chapterId)} className="inline-flex bg-gray-100 p-2 rounded cursor-pointer mt-2">+ Add Lecture</div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div className="flex justify-center items-center  bg-blue-100 p-2 rounded-lg cursor-pointer mt-2" onClick={() => handleChapter('add')}>+ Add Chapter</div>
                        </div>
                        {showLecturePopup && (
                            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white text-gray-700 rounded p-6 w-[1000px] space-y-3 relative overflow-y-auto max-h-[90vh]">
                                    <h2 className="font-semibold">{currentLectureIndex !== null ? 'Edit Lecture' : 'Add Lecture'}</h2>
                                    <div className="mb-2"><p>Lecture Title</p><input type="text" value={lectureDetails.lectureTitle} onChange={(e) => setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })} className="mt-1 block w-full border rounded px-2 py-1" /></div>
                                    <div className="mb-2"><p>Duration (minits)</p><input type="text" value={lectureDetails.lectureDuration} onChange={(e) => setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })} className="mt-1 block w-full border rounded px-2 py-1" /></div>


                                    <div className="mb-2">
                                        <p>Resource Type</p>
                                        <select
                                            value={lectureDetails.resourceType}
                                            onChange={(e) => setLectureDetails({ ...lectureDetails, resourceType: e.target.value as any })}
                                            className="mt-1 block w-full border rounded px-2 py-1"
                                        >
                                            <option value="video">Video URL</option>
                                            <option value="pdf">PDF Document</option>
                                            <option value="ppt">Presentation (PPT)</option>
                                            <option value="html-file">HTML File</option>
                                            <option value="quiz">Quiz</option>
                                        </select>
                                    </div>

                                    {lectureDetails.resourceType === 'quiz' ? (
                                        <div className="mb-2">
                                            <div className="flex justify-between items-center mb-2">
                                                <p>Quiz Questions</p>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newQuestions = [
                                                            ...(lectureDetails.questions || []),
                                                            {
                                                                questionId: uuidv4(),
                                                                question: '',
                                                                options: ['', '', '', ''],
                                                                correctAnswer: ''
                                                            }
                                                        ];
                                                        setLectureDetails({ ...lectureDetails, questions: newQuestions });
                                                    }}
                                                    className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded"
                                                >
                                                    + Add Question
                                                </button>
                                            </div>

                                            {(lectureDetails.questions || []).map((q, qIndex) => (
                                                <div key={q.questionId} className="border p-3 rounded mb-3 bg-gray-50">
                                                    <div className="flex justify-between mb-2">
                                                        <span className="font-medium">Question {qIndex + 1}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newQuestions = lectureDetails.questions?.filter((_, i) => i !== qIndex);
                                                                setLectureDetails({ ...lectureDetails, questions: newQuestions });
                                                            }}
                                                            className="text-red-500 text-xs"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>

                                                    <input
                                                        type="text"
                                                        placeholder="Enter Question"
                                                        value={q.question}
                                                        onChange={(e) => {
                                                            const newQuestions = [...(lectureDetails.questions || [])];
                                                            newQuestions[qIndex].question = e.target.value;
                                                            setLectureDetails({ ...lectureDetails, questions: newQuestions });
                                                        }}
                                                        className="w-full border rounded px-2 py-1 mb-2 text-sm"
                                                    />

                                                    <div className="space-y-2 pl-2">
                                                        {q.options.map((opt, optIndex) => (
                                                            <div key={optIndex} className="flex gap-2 items-center">
                                                                <input
                                                                    type="radio"
                                                                    name={`correct-${q.questionId}`}
                                                                    checked={q.correctAnswer === opt && opt !== ''}
                                                                    onChange={() => {
                                                                        const newQuestions = [...(lectureDetails.questions || [])];
                                                                        newQuestions[qIndex].correctAnswer = opt;
                                                                        setLectureDetails({ ...lectureDetails, questions: newQuestions });
                                                                    }}
                                                                    title="Mark as correct answer"
                                                                    disabled={opt === ''}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder={`Option ${optIndex + 1}`}
                                                                    value={opt}
                                                                    onChange={(e) => {
                                                                        const newQuestions = [...(lectureDetails.questions || [])];
                                                                        newQuestions[qIndex].options[optIndex] = e.target.value;
                                                                        if (q.correctAnswer === opt) {
                                                                            newQuestions[qIndex].correctAnswer = e.target.value;
                                                                        }
                                                                        setLectureDetails({ ...lectureDetails, questions: newQuestions });
                                                                    }}
                                                                    className="w-full border rounded px-2 py-1 text-sm bg-white"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : lectureDetails.resourceType === 'video' ? (
                                        <div className="mb-2"><p>Lecture URL</p><input type="text" value={lectureDetails.lectureUrl} onChange={(e) => setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value })} className="mt-1 block w-full border rounded px-2 py-1" /></div>
                                    ) : (
                                        <div className="mb-2">
                                            <p>Upload {lectureDetails.resourceType.toUpperCase()}</p>
                                            <input
                                                type="file"
                                                accept={
                                                    lectureDetails.resourceType === 'pdf' ? '.pdf' :
                                                        lectureDetails.resourceType === 'ppt' ? '.ppt,.pptx' :
                                                            lectureDetails.resourceType === 'html-file' ? '.html,.htm' : '*/*'
                                                }
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        setUploadProgress(0);
                                                        setIsUploading(true);
                                                        const formData = new FormData();
                                                        formData.append('file', file);
                                                        formData.append('resourceType', lectureDetails.resourceType);

                                                        try {
                                                            const { data } = await axios.post(backendUrl + '/api/admin/upload-resource', formData, {
                                                                headers: { 'Content-Type': 'multipart/form-data' },
                                                                onUploadProgress: (progressEvent) => {
                                                                    const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
                                                                    setUploadProgress(percentCompleted);
                                                                }
                                                            });
                                                            if (data.success) {
                                                                setLectureDetails({ ...lectureDetails, lectureUrl: data.url });
                                                                toast.success("File uploaded successfully");
                                                            } else {
                                                                toast.error(data.message);
                                                            }
                                                        } catch (error: any) {
                                                            toast.error("Upload failed");
                                                        } finally {
                                                            setIsUploading(false);
                                                        }
                                                    }
                                                }}
                                                className="mt-1 block w-full border rounded px-2 py-1"
                                            />
                                            {isUploading && (
                                                <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                                                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                                                    <p className="text-xs text-center mt-1">{uploadProgress}% Uploaded</p>
                                                </div>
                                            )}
                                            {lectureDetails.lectureUrl && !isUploading && <p className="text-sm text-green-500 mt-2">File attached: <a href={lectureDetails.lectureUrl} target="_blank" rel="noopener noreferrer" className="underline">Preview</a></p>}
                                        </div>
                                    )}


                                    <div className="mb-8 relative">
                                        <p className="mb-1">Lecture Content (Description, Images, Videos)</p>
                                        <div className="bg-white text-black h-80 rounded relative">
                                            <ReactQuill
                                                ref={lectureQuillRef}
                                                theme="snow"
                                                value={lectureDetails.lectureContent}
                                                onChange={(content) => setLectureDetails({ ...lectureDetails, lectureContent: content })}
                                                modules={quillModules}
                                                className="h-full"
                                            />
                                            {selectedImageInfo && (
                                                <div
                                                    className="delete-image-btn absolute z-50 bg-red-600 text-white p-2 rounded-md font-semibold cursor-pointer shadow-lg hover:bg-red-700 hover:scale-105 transition-all text-sm flex items-center gap-1"
                                                    style={{ position: 'fixed', top: selectedImageInfo.top - 45, left: selectedImageInfo.left }}
                                                    onClick={deleteSelectedImage}
                                                >
                                                    🗑️ Delete Image
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 mt-12 mb-4"><p>Is Priview Free?</p><input type="checkbox" checked={lectureDetails.isPreviewFree} className="mt-1 scale-125" onChange={(e) => setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })} /></div>
                                    <button type="button" onClick={addLecture} disabled={isUploading} className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400">{currentLectureIndex !== null ? 'Update' : 'Add'}</button>
                                    <img src={assets.cross_icon} alt="cross_icon" onClick={() => setShowLecturePopup(false)} className="absolute top-4 right-4 w-4 cursor-pointer" />
                                </div>
                            </div>
                        )}
                        <button type="submit" className=" flex justify-center items-center text-white bg-blue-900 p-2 rounded-lg cursor-pointer mt-2" >{id ? "Update" : "Add"}</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AdminAddCourse
