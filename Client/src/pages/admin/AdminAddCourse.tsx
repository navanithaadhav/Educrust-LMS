import React, { useEffect, useRef, useState } from "react";
import Quill from "quill";
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
    const quillRef = useRef<Quill | null>(null);
    const editorRef = useRef<HTMLDivElement>(null);
    const lectureQuillRef = useRef<Quill | null>(null);
    const lectureEditorRef = useRef<HTMLDivElement>(null);

    const [courseTitle, setCourseTitle] = useState("");
    const [coursePrice, setCoursePrice] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [image, setImage] = useState<File | null>(null);
    const [chapters, setChapters] = useState<UIChapter[]>([]);
    const [showLecturePopup, setShowLecturePopup] = useState(false);
    const [currentChapterId, setCurrentChapterId] = useState<string | null>(null);
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
        isPreviewFree: boolean;
        lectureContent: string;
        resourceType: 'video' | 'pdf' | 'ppt' | 'html-file';
    }>({
        lectureTitle: "",
        lectureDuration: "",
        lectureUrl: "",
        isPreviewFree: false,
        lectureContent: "",
        resourceType: "video",
    });

    const [isUploading, setIsUploading] = useState(false);

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

    const handleLecture = (action: 'add' | 'remove', chapterId: string, lectureIndex?: number) => {
        if (action === 'add') {
            openLecturePopup(chapterId);
            setShowLecturePopup(true);
        } else if (action === 'remove' && lectureIndex !== undefined) {
            setChapters(chapters.map(ch => ch.chapterId === chapterId ? { ...ch, chapterContent: ch.chapterContent.filter((_, index) => index !== lectureIndex) } : ch));
        }
    }

    useEffect(() => {
        if (!quillRef.current && editorRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: "snow",
            });
        }
    }, []);

    useEffect(() => {
        if (showLecturePopup && !lectureQuillRef.current && lectureEditorRef.current) {
            lectureQuillRef.current = new Quill(lectureEditorRef.current, {
                theme: "snow",
                modules: {
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
                }
            });
            if (lectureDetails.lectureContent) {
                lectureQuillRef.current.root.innerHTML = lectureDetails.lectureContent;
            }
        }
    }, [showLecturePopup]);

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
                if (quillRef.current) {
                    quillRef.current.root.innerHTML = course.courseDescription;
                }
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

        const content = lectureQuillRef.current?.root.innerHTML || "";

        setChapters(chapters.map((ch) => {
            if (ch.chapterId === currentChapterId) {
                const newLecture: Lecture = {
                    ...lectureDetails,
                    lectureContent: content,
                    lectureOrder: ch.chapterContent.length > 0 ? (ch.chapterContent.slice(-1)[0].lectureOrder || 0) + 1 : 1,
                    lectureId: uuidv4()
                };
                ch.chapterContent.push(newLecture)
            };
            return ch
        }));

        setShowLecturePopup(false);
        setLectureDetails({
            lectureTitle: "",
            lectureDuration: "",
            lectureUrl: "",
            isPreviewFree: false,
            lectureContent: "",
            resourceType: "video",
        });
        lectureQuillRef.current = null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!image && !id) {
            toast.error('Thumbnail Not Attached')
            return;
        }

        const courseData = {
            courseTitle,
            courseDescription: quillRef.current?.root.innerHTML,
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
                    if (quillRef.current) {
                        quillRef.current.root.innerHTML = ""
                    }
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
                        <div><p>Course Description</p><div ref={editorRef} className="h-40 border rounded"></div></div>
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
                                                    <img src={assets.cross_icon} alt="cross_icon" onClick={() => handleLecture('remove', chapter.chapterId, lectureIndex)} className="cursor-pointer" />
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
                                    <h2 className="font-semibold">Add Lecture</h2>
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
                                        </select>
                                    </div>

                                    {lectureDetails.resourceType === 'video' ? (
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
                                                        setIsUploading(true);
                                                        const formData = new FormData();
                                                        formData.append('file', file);
                                                        formData.append('resourceType', lectureDetails.resourceType);

                                                        try {
                                                            const { data } = await axios.post(backendUrl + '/api/admin/upload-resource', formData, {
                                                                headers: { 'Content-Type': 'multipart/form-data' }
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
                                            {isUploading && <p className="text-sm text-blue-500">Uploading...</p>}
                                            {lectureDetails.lectureUrl && !isUploading && <p className="text-sm text-green-500">File attached: {lectureDetails.lectureUrl}</p>}
                                        </div>
                                    )}


                                    <div className="mb-2">
                                        <p>Lecture Content (Description, Images, Videos)</p>
                                        <div ref={lectureEditorRef} className="h-96 border rounded bg-white text-black"></div>
                                    </div>

                                    <div className="flex items-center gap-2 my-4"><p>Is Priview Free?</p><input type="checkbox" checked={lectureDetails.isPreviewFree} className="mt-1 scale-125" onChange={(e) => setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })} /></div>
                                    <button type="button" onClick={addLecture} className="bg-blue-500 text-white px-4 py-2 rounded">Add</button>
                                    <img src={assets.cross_icon} alt="cross_icon" onClick={() => { setShowLecturePopup(false); lectureQuillRef.current = null; }} className="absolute top-4 right-4 w-4 cursor-pointer" />
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
